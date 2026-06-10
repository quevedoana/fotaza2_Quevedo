import { Post, Photo, Tag, Comment, User, Rating } from "../models/index.js";

export const getCrear = (req, res) => {
  res.render("posts/create");
};

export const postCrear = async (req, res) => {
  const { titulo, descripcion, etiquetas, imagenesBase64 } = req.body;

  if (!imagenesBase64) {
    return res.render("posts/create", {
      error: "Debés subir al menos una imagen",
    });
  }
  if (!titulo?.trim()) {
    return res.render("posts/create", {
      error: "El título es obligatorio",
    });
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
  const fotoIndex = Number(req.query.foto || 0);

  try {
    const post = await Post.findByPk(id, {
      include: [
        {
          model: Photo,
          as: "Photos",
          include: [
            {
              model: Comment,
              as: "Comments",
              include: [
                {
                  model: User,
                  as: "Author",
                },
              ],
            },
            {
              model: Rating,
              as: "Ratings",
            },
          ],
        },
        { model: Tag, as: "Tags" },
        { model: User, as: "Author" },
      ],
    });

    if (!post) {
      return res.render("posts/show", {
        post: null,
        fotos: "[]",
      });
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

    const fotoActual = postData.Photos[fotoIndex] || postData.Photos[0];

    const ratings = fotoActual.Ratings || [];

    const promedio =
      ratings.length > 0
        ? (
            ratings.reduce((sum, r) => sum + Number(r.score), 0) /
            ratings.length
          ).toFixed(1)
        : "0.0";

    res.render("posts/show", {
      post: postData,
      fotos: JSON.stringify(fotos),
      fotoActual,
      fotoIndex,
      promedio,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error del servidor: " + err.message);
  }
};

export const index = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: Photo,
          as: "Photos",
          include: [
            {
              model: Comment,
              as: "Comments",
            },
            {
              model: Rating,
              as: "Ratings",
            },
          ],
        },
        {
          model: Tag,
          as: "Tags",
        },
        {
          model: User,
          as: "Author",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const postsConImagenes = posts.map((post) => {
      const data = post.toJSON();

      data.Photos = data.Photos.map((photo) => ({
        ...photo,
        imageSrc: photo.photo
          ? `data:image/jpeg;base64,${Buffer.from(photo.photo).toString("base64")}`
          : null,
      }));

      let totalComentarios = 0;
      let totalRatings = 0;
      let sumaRatings = 0;

      data.Photos.forEach((photo) => {
        totalComentarios += photo.Comments?.length || 0;

        if (photo.Ratings?.length) {
          totalRatings += photo.Ratings.length;

          sumaRatings += photo.Ratings.reduce(
            (sum, r) => sum + Number(r.score),
            0,
          );
        }
      });

      data.cantidadComentarios = totalComentarios;

      data.promedioRating =
        totalRatings > 0 ? (sumaRatings / totalRatings).toFixed(1) : null;

      return data;
    });

    res.render("posts/index", {
      title: "Publicaciones",
      posts: postsConImagenes,
    });
  } catch (err) {
    console.error(err);

    res.render("posts/index", {
      title: "Publicaciones",
      posts: [],
    });
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

    postData.description = postData.description
  ? postData.description.replaceAll("<div></div>", "")
  : "";

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
  const { titulo, descripcion, etiquetas } = req.body

  const descripcionLimpia = descripcion
    ? descripcion.replace(/<[^>]*>/g, '').trim()
    : null

  try {
    const post = await Post.findOne({ where: { idPost: req.params.id } })
    if (!post) return res.redirect('/publicaciones')

    if (post.idUser !== req.session.user.idUser) {
      return res.status(403).send('No autorizado')
    }

    await post.update({
      title: titulo,
      description: descripcionLimpia,
    })

    if (etiquetas) {
      await post.setTags([])

      const tags = etiquetas.split(',').map(t => t.trim()).filter(t => t)
      for (const tagName of tags) {
        const [tag] = await Tag.findOrCreate({
          where: { nameTag: tagName.toLowerCase() }
        })
        await post.addTag(tag)
      }
    }

    res.redirect('/publicaciones')

  } catch (err) {
    console.error(err)
    res.redirect('/publicaciones')
  }
}


export const eliminar = async (req, res) => {
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

    await Photo.destroy({
      where: { idPost: post.idPost },
    });

    await post.setTags([]);

    await post.destroy();

    res.redirect("/publicaciones");
  } catch (err) {
    console.error(err);
    res.redirect("/publicaciones");
  }
};
