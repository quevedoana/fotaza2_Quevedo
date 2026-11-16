
import { Post, Photo, Tag, Comment, User, Rating } from "../models/index.js";

// Mostrar formulario de creación
export const getCrear = (req, res) => {
  res.render("posts/create");
};

// Crear publicación
export const postCrear = async (req, res) => {
  const { titulo, descripcion, etiquetas, imagenesBase64 } = req.body;

  if (!imagenesBase64 || (Array.isArray(imagenesBase64) && imagenesBase64.length === 0)) {
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
      title: titulo.trim(),
      description: descripcion,
      idUser: req.session.user.idUser,
    });

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

    if (etiquetas) {
      const tags = etiquetas
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t);

      for (const tagName of tags) {
        const [tag] = await Tag.findOrCreate({
          where: { nameTag: tagName },
        });

        await post.addTag(tag);
      }
    }

    res.redirect("/publicaciones");
  } catch (err) {
    console.error("Error al crear publicación:", err);
    res.redirect("/publicaciones/crear");
  }
};

// Mostrar una publicación
export const show = async (req, res) => {
  const { id } = req.params;

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
                  attributes: ["idUser", "userName"],
                },
              ],
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
      ],
    });

    if (!post) {
      return res.render("posts/show", {
        post: null,
        fotos: "[]",
      });
    }

    const postData = post.toJSON();

    // Convertimos las imágenes a Base64 para mostrarlas
    postData.Photos = postData.Photos.map((photo) => ({
      ...photo,
      imageSrc: photo.photo
        ? `data:image/jpeg;base64,${Buffer.from(photo.photo).toString("base64")}`
        : null,
    }));

    // Preparamos las imágenes para el carrusel
    const fotos = postData.Photos
      .map((photo) => photo.imageSrc)
      .filter((foto) => foto !== null);

    res.render("posts/show", {
      post: postData,
      fotos: JSON.stringify(fotos),
    });
  } catch (err) {
    console.error("Error al mostrar publicación:", err);
    res.status(500).send("Error del servidor: " + err.message);
  }
};

// Listar publicaciones
export const index = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: Photo,
          as: "Photos",
          include: [
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

      let totalRatings = 0;
      let sumaRatings = 0;

      // Recorremos todas las fotos de la publicación
      data.Photos.forEach((photo) => {
        const ratings = photo.Ratings || [];

        totalRatings += ratings.length;

        sumaRatings += ratings.reduce(
          (sum, rating) => sum + Number(rating.score),
          0
        );
      });

      // Calculamos el promedio de todas las valoraciones
      data.promedioRating =
        totalRatings > 0
          ? (sumaRatings / totalRatings).toFixed(1)
          : null;

      data.cantidadValoraciones = totalRatings;

      // Convertimos las imágenes a Base64
      data.Photos = data.Photos.map((photo) => ({
        ...photo,
        imageSrc: photo.photo
          ? `data:image/jpeg;base64,${Buffer.from(photo.photo).toString("base64")}`
          : null,
      }));

      return data;
    });

    res.render("posts/index", {
      title: "Publicaciones",
      posts: postsConImagenes,
    });
  } catch (err) {
    console.error("Error al cargar las publicaciones:", err);

    res.render("posts/index", {
      title: "Publicaciones",
      posts: [],
    });
  }
};

// Mostrar formulario de edición
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

    if (Number(post.idUser) !== Number(req.session.user.idUser)) {
      return res.status(403).send("No autorizado");
    }

    const postData = post.toJSON();

    postData.description = postData.description
      ? postData.description.replace(/<div><\/div>/g, "")
      : "";

    postData.Photos = postData.Photos.map((photo) => ({
      ...photo,
      imageSrc: photo.photo
        ? `data:image/jpeg;base64,${Buffer.from(photo.photo).toString("base64")}`
        : null,
    }));

    const tagsString = postData.Tags
      .map((tag) => tag.nameTag)
      .join(", ");

    res.render("posts/edit", {
      title: "Editar Publicación",
      post: postData,
      tagsString,
    });
  } catch (err) {
    console.error("Error al cargar formulario de edición:", err);
    res.redirect("/publicaciones");
  }
};

// Procesar edición
export const postEditar = async (req, res) => {
  const { titulo, descripcion, etiquetas } = req.body;

  const descripcionLimpia = descripcion
    ? descripcion.replace(/<[^>]*>/g, "").trim()
    : null;

  try {
    const post = await Post.findOne({
      where: { idPost: req.params.id },
    });

    if (!post) {
      return res.redirect("/publicaciones");
    }

    if (Number(post.idUser) !== Number(req.session.user.idUser)) {
      return res.status(403).send("No autorizado");
    }

    await post.update({
      title: titulo,
      description: descripcionLimpia,
    });

    if (etiquetas !== undefined) {
      await post.setTags([]);

      const tags = etiquetas
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag);

      for (const tagName of tags) {
        const [tag] = await Tag.findOrCreate({
          where: { nameTag: tagName },
        });

        await post.addTag(tag);
      }
    }

    res.redirect("/publicaciones");
  } catch (err) {
    console.error("Error al editar publicación:", err);
    res.redirect("/publicaciones");
  }
};

// Eliminar publicación
export const eliminar = async (req, res) => {
  try {
    const post = await Post.findOne({
      where: { idPost: req.params.id },
    });

    if (!post) {
      return res.redirect("/publicaciones");
    }

    if (Number(post.idUser) !== Number(req.session.user.idUser)) {
      return res.status(403).send("No autorizado");
    }

    await Photo.destroy({
      where: { idPost: post.idPost },
    });

    await post.setTags([]);

    await post.destroy();

    res.redirect("/publicaciones");
  } catch (err) {
    console.error("Error al eliminar publicación:", err);
    res.redirect("/publicaciones");
  }
};
