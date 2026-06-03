import { Rating, Photo, Post } from "../models/index.js";

export const valorar = async (req, res) => {
  try {
    const { idPost, idPhoto } = req.params;
    const { score } = req.body;

    const foto = await Photo.findByPk(idPhoto, {
      include: [
        {
          model: Post,
          as: "Post",
        },
      ],
    });

    if (!foto) {
      return res.redirect(`/publicaciones/${idPost}`);
    }

    // No permitir valorar publicaciones propias
    if (foto.Post.idUser === req.session.user.idUser) {
      return res.redirect(`/publicaciones/${idPost}`);
    }

    const ratingExistente = await Rating.findOne({
      where: {
        idPhoto,
        idUser: req.session.user.idUser,
      },
    });

    if (ratingExistente) {
      await ratingExistente.update({
        score,
      });
    } else {
      await Rating.create({
        idPhoto,
        idUser: req.session.user.idUser,
        score,
      });
    }

    res.redirect(`/publicaciones/${idPost}`);
  } catch (err) {
    console.error(err);
    res.redirect(`/publicaciones/${req.params.idPost}`);
  }
};