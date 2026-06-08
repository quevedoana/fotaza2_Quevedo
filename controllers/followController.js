import { Follower } from "../models/index.js";

export const seguir = async (req, res) => {
  try {
    const { id } = req.params;

    const followerId = req.session.user.idUser;
    const followeeId = Number(id);

    if (followerId === followeeId) {
      return res.redirect(`/perfil/${id}`);
    }

    const existe = await Follower.findOne({
      where: {
        followerId,
        followeeId,
      },
    });

    if (!existe) {
      await Follower.create({
        followerId,
        followeeId,
      });
    }

    res.redirect(`/perfil/${id}`);
  } catch (err) {
    console.error(err);
    res.redirect(`/perfil/${req.params.id}`);
  }
};

export const dejarDeSeguir = async (req, res) => {
  try {
    const { id } = req.params;

    await Follower.destroy({
      where: {
        followerId: req.session.user.idUser,
        followeeId: Number(id),
      },
    });

    res.redirect(`/perfil/${id}`);
  } catch (err) {
    console.error(err);
    res.redirect(`/perfil/${req.params.id}`);
  }
};