import { Comment, Photo, Post } from "../models/index.js";

const buscarFoto = (idPhoto) =>
  Photo.findByPk(idPhoto, { include: [{ model: Post, as: "Post" }] });

export const agregar = async (req, res) => {
  const { idPost, idPhoto } = req.params;
  // la columna es STRING (255), por eso el slice
  const description = req.body.description?.trim().slice(0, 255);

  try {
    const foto = await buscarFoto(idPhoto);

    if (!foto || !foto.commentsActive || !description) {
      return res.redirect(`/publicaciones/${idPost}`);
    }

    await Comment.create({
      description,
      idUser: req.session.user.idUser,
      idPhoto,
    });

    res.redirect(`/publicaciones/${idPost}`);
  } catch (err) {
    console.error(err);
    res.redirect(`/publicaciones/${idPost}`);
  }
};

// solo el autor de la publicación puede abrir o cerrar comentarios
const cambiarEstado = (activo) => async (req, res) => {
  const { idPost, idPhoto } = req.params;

  try {
    const foto = await buscarFoto(idPhoto);

    if (!foto || foto.Post.idUser !== req.session.user.idUser) {
      return res.status(403).send("No autorizado");
    }

    await foto.update({ commentsActive: activo });
    res.redirect(`/publicaciones/${idPost}`);
  } catch (err) {
    console.error(err);
    res.redirect(`/publicaciones/${idPost}`);
  }
};

export const cerrar = cambiarEstado(false);
export const abrir = cambiarEstado(true);