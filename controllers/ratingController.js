
import { Rating, Photo, Post } from "../models/index.js";

export const valorar = async (req, res) => {
  const { idPost, idPhoto } = req.params;

  try {
    // Verificar que haya un usuario autenticado
    if (!req.session.user) {
      return res.redirect("/login");
    }

    const idUser = req.session.user.idUser;
    const score = Number(req.body.score);

    // Validar que la puntuación sea un entero entre 1 y 5
    if (
      !Number.isInteger(score) ||
      score < 1 ||
      score > 5
    ) {
      return res.redirect(`/publicaciones/${idPost}`);
    }

    // Buscar la foto y su publicación
    const foto = await Photo.findByPk(idPhoto, {
      include: [
        {
          model: Post,
          as: "Post",
        },
      ],
    });

    if (!foto || !foto.Post) {
      return res.redirect(`/publicaciones/${idPost}`);
    }

    // No permitir valorar publicaciones propias
    if (Number(foto.Post.idUser) === Number(idUser)) {
      return res.redirect(`/publicaciones/${idPost}`);
    }

    // Buscar si el usuario ya valoró esta foto
    const ratingExistente = await Rating.findOne({
      where: {
        idPhoto,
        idUser,
      },
    });

    if (ratingExistente) {
      // Actualizar la valoración existente
      await ratingExistente.update({ score });
    } else {
      // Crear una nueva valoración
      await Rating.create({
        idPhoto,
        idUser,
        score,
      });
    }

    return res.redirect(`/publicaciones/${idPost}`);

  } catch (err) {
    console.error("Error al valorar la foto:", err);
    return res.redirect(`/publicaciones/${idPost}`);
  }
};
