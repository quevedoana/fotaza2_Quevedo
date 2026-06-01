import { Post, Photo, Tag, Comment, User } from "../models/index.js";

export const getCrear = (req, res) => {
  res.render("posts/create");
};

export const postCrear = async (req, res) => {
  const { titulo, descripcion, etiquetas, imagenesBase64 } = req.body;

  if (!imagenesBase64) {
    console.log("no se subió ninguna imagen");
    return res.redirect("/publicaciones/crear");
  }
  try {
    const post = await Post.create({
      title: titulo,
      description: descripcion,
      idUser: req.session.user.idUser,
    });

    if (imagenesBase64) {
      const imagenes = Array.isArray(imagenesBase64)
        ? imagenesBase64
        : [imagenesBase64];

      for (const base64 of imagenes) {
        const base64Data = base64.split(",")[1] || base64;
        const imageBuffer = Buffer.from(base64Data, "base64");

        await Photo.create({
          idPost: post.idPost,
          photo: imageBuffer,
          copyright: false,
          commentsActive: true,
        });
      }
    }

    if (etiquetas) {
      const tags = etiquetas
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);
      for (const tagName of tags) {
        const [tag] = await Tag.findOrCreate({
          where: { nameTag: tagName.toLowerCase() },
        });
        await post.addTag(tag);
      }
    }

    res.redirect("/publicaciones");
  } catch (err) {
    console.error(err);
    res.redirect("/publicaciones/crear");
  }
};
export const show = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findByPk(id, {
      include: [
        {
          model: Photo,
          as: "Photos",
          include: [{ model: Comment, as: "Comments" }],
        },
        { model: Tag, as: "Tags" },
        { model: User, as: "Author" },
      ],
    });

    if (!post) {
      return res.render("posts/show", { post: null, fotos: "[]" });
    }

    const postData = post.toJSON();

    postData.Photos = postData.Photos.map((photo) => ({
      ...photo,
      imageSrc: photo.photo
        ? `data:image/jpeg;base64,${Buffer.from(photo.photo).toString("base64")}`
        : null,
    }));

    const fotos = postData.Photos.map((p) => p.imageSrc).filter(
      (f) => f !== null,
    );

    res.render("posts/show", {
      post: postData,
      fotos: JSON.stringify(fotos),
    });
  } catch (err) {
    res.status(500).send("Error del servidor: " + err.message);
  }
};

export const index = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        { model: Photo, as: "Photos", limit: 1 },
        { model: Tag, as: "Tags" },
        { model: User, as: "Author" },
      ],
      order: [["createdAt", "DESC"]],
    });

    const postsConImagenes = posts.map((post) => ({
      ...post.toJSON(),
      Photos: post.Photos.map((photo) => ({
        ...photo.toJSON(),
        imageSrc: photo.photo
          ? `data:image/jpeg;base64,${Buffer.from(photo.photo).toString("base64")}`
          : null,
      })),
    }));

    res.render("posts/index", {
      title: "Publicaciones",
      posts: postsConImagenes,
    });
  } catch (err) {
    console.error(err);
    res.render("posts/index", { title: "Publicaciones", posts: [] });
  }
};

export const getEditar = async (req, res) => {
  try {
    const post = await Post.findOne({
      where: { idPost: req.params.id },
      include: [
        { model: Photo, as: "Photos" },
        { model: Tag, as: "Tags" },
      ],
    });

    if (!post) {
      return res.redirect("/publicaciones");
    }

    if (post.idUser !== req.session.user.idUser) {
      return res.status(403).send("No autorizado");
    }

    const postData = post.toJSON();

    postData.Photos = postData.Photos.map((photo) => ({
      ...photo,
      imageSrc: photo.photo
        ? `data:image/jpeg;base64,${Buffer.from(photo.photo).toString("base64")}`
        : null,
    }));

    const tagsString = postData.Tags.map((t) => t.nameTag).join(", ");

    res.render("posts/edit", {
      title: "Editar Publicación",
      post: postData,
      tagsString,
    });
  } catch (err) {
    console.error(err);
    res.redirect("/publicaciones");
  }
};

export const postEditar = async (req, res) => {
  const { titulo, descripcion, etiquetas, imagenesBase64 } = req.body;

  try {
    const post = await Post.findOne({
      where: { idPost: req.params.id },
    });

    if (!post) {
      return res.redirect("/publicaciones");
    }

    if (post.idUser !== req.session.user.idUser) {
      return res.status(403).send("No autorizado");
    }

    await post.update({
      title: titulo,
      description: descripcion,
    });
    //PREGUNTAR SI LAS IMAGENES SE EDITAN O SOLO EL TITULO Y LA DESCRIPCION
    if (imagenesBase64) {
      await Photo.destroy({ where: { idPost: post.idPost } });

      const imagenes = Array.isArray(imagenesBase64)
        ? imagenesBase64
        : [imagenesBase64];

      for (const base64 of imagenes) {
        const base64Data = base64.split(",")[1] || base64;
        const imageBuffer = Buffer.from(base64Data, "base64");

        await Photo.create({
          idPost: post.idPost,
          photo: imageBuffer,
          copyright: false,
          commentsActive: true,
        });
      }
    }
    if (etiquetas) {
      await post.setTags([]);
      const tags = etiquetas
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);
      for (const tagName of tags) {
        const [tag] = await Tag.findOrCreate({
          where: { nameTag: tagName.toLowerCase() },
        });
        await post.addTag(tag);
      }
    }

    res.redirect("/publicaciones");
  } catch (err) {
    console.error(err);
    res.redirect("/publicaciones");
  }
};

export const eliminar = async (req, res) => {
  try {

    const post = await Post.findOne({
      where: { idPost: req.params.id }
    });

    if (!post) {
      return res.redirect("/publicaciones");
    }

    if (post.idUser !== req.session.user.idUser) {
      return res.status(403).send("No autorizado");
    }

    await Photo.destroy({
      where: { idPost: post.idPost }
    });

    await post.setTags([]);

    await post.destroy();

    res.redirect("/publicaciones");

  } catch (err) {
    console.error(err);
    res.redirect("/publicaciones");
  }
};
