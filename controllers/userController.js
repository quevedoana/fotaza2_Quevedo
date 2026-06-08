import { User, Post, Photo, Follower } from "../models/index.js";

export const perfil = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: [
        {
          model: Post,
          as: "Posts",
          include: [
            {
              model: Photo,
              as: "Photos",
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).send("Usuario no encontrado");
    }

    const userData = user.toJSON();

    userData.Posts = userData.Posts.map(post => ({
      ...post,
      portada:
        post.Photos.length > 0
          ? `data:image/jpeg;base64,${Buffer.from(
              post.Photos[0].photo
            ).toString("base64")}`
          : null,
    }));

    const seguidores = await Follower.count({
      where: {
        followeeId: id,
      },
    });

    const seguidos = await Follower.count({
      where: {
        followerId: id,
      },
    });

    let yaLoSigo = false;

    if (req.session.user) {
      const relacion = await Follower.findOne({
        where: {
          followerId: req.session.user.idUser,
          followeeId: id,
        },
      });

      yaLoSigo = !!relacion;
    }

    res.render("users/profile", {
      userProfile: userData,
      seguidores,
      seguidos,
      yaLoSigo,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};