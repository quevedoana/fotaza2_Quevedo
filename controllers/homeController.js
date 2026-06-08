import { User, Post, Photo } from "../models/index.js";
import sequelize from "../db/config.js";

export const index = async (req, res) => {
  try {

    let posts = [];

    if (!req.session.user) {

      posts = await Post.findAll({
        include: [
          {
            model: Photo,
            as: "Photos",
          },
          {
            model: User,
            as: "Author",
          },
        ],
        order: sequelize.random(),
        limit: 12,
      });

      const postsData = posts.map(post => {
        const data = post.toJSON();

        data.portada =
          data.Photos.length > 0
            ? `data:image/jpeg;base64,${Buffer.from(
                data.Photos[0].photo
              ).toString("base64")}`
            : null;

        return data;
      });

      return res.render("index", {
        posts: postsData,
        feed: false,
      });
    }

    const usuario = await User.findByPk(
      req.session.user.idUser,
      {
        include: [
          {
            model: User,
            as: "Following",
          },
        ],
      }
    );

    const idsSeguidos = usuario.Following.map(
      u => u.idUser
    );

    if (idsSeguidos.length > 0) {

      posts = await Post.findAll({
        where: {
          idUser: idsSeguidos,
        },
        include: [
          {
            model: Photo,
            as: "Photos",
          },
          {
            model: User,
            as: "Author",
          },
        ],
        order: [["createdAt", "DESC"]],
      });

    } else {

      posts = await Post.findAll({
        include: [
          {
            model: Photo,
            as: "Photos",
          },
          {
            model: User,
            as: "Author",
          },
        ],
        order: sequelize.random(),
        limit: 12,
      });

    }

    const postsData = posts.map(post => {

      const data = post.toJSON();

      data.portada =
        data.Photos.length > 0
          ? `data:image/jpeg;base64,${Buffer.from(
              data.Photos[0].photo
            ).toString("base64")}`
          : null;

      return data;
    });

    res.render("index", {
      posts: postsData,
      feed: true,
      siguePersonas: idsSeguidos.length > 0,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};