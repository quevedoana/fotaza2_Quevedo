import { Comment, Photo, Post } from "../models/index.js";

export const agregar = async (req, res) => {
  console.log("ENTRO A AGREGAR COMENTARIO");
  const { idPost, idPhoto } = req.params;
  const { description } = req.body;

  try {
    const foto = await Photo.findByPk(idPhoto);
    console.log("ID PHOTO:", idPhoto)
    console.log("FOTO:", foto)

    if (!foto) return res.redirect(`/publicaciones/${idPost}`);

    if (!foto.commentsActive) {
      return res.redirect(`/publicaciones/${idPost}`);
    }
    console.log("SESSION:", req.session);
    console.log("USER:", req.session.user);
    if (!req.session.user) {
      return res.redirect("/login");
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

export const cerrar = async (req, res) => {
  const { idPost, idPhoto } = req.params;

  try {
    const foto = await Photo.findByPk(idPhoto);
    if (!foto) return res.redirect(`/publicaciones/${idPost}`);

    await foto.update({ commentsActive: false });

    res.redirect(`/publicaciones/${idPost}`);
  } catch (err) {
    console.error(err);
    res.redirect(`/publicaciones/${idPost}`);
  }
};
export const abrir = async (req, res) => {
  const { idPost, idPhoto } = req.params

  try {

    const foto = await Photo.findByPk(idPhoto)

    if (!foto) {
      return res.redirect(`/publicaciones/${idPost}`)
    }

    await foto.update({
      commentsActive: true
    })

    res.redirect(`/publicaciones/${idPost}`)

  } catch (err) {
    console.error(err)
    res.redirect(`/publicaciones/${idPost}`)
  }
}
