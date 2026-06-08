import { Post, User, Tag, Photo } from "../models/index.js";
import { Op } from "sequelize";

export const buscar = async (req, res) => {
  try {

    const {
      q = "",
      autor = "",
      tag = "",
      orden = "recientes"
    } = req.query;

    const wherePost = {};

    if (q) {
      wherePost[Op.or] = [
        {
          title: {
            [Op.iLike]: `%${q}%`,
          },
        },
        {
          description: {
            [Op.iLike]: `%${q}%`,
          },
        },
        {
          "$Author.userName$": {
            [Op.iLike]: `%${q}%`,
          },
        },
        {
          "$Tags.nameTag$": {
            [Op.iLike]: `%${q}%`,
          },
        },
      ];
    }

    const publicaciones = await Post.findAll({
      where: wherePost,

      include: [
        {
          model: User,
          as: "Author",
          where: autor
            ? {
                userName: {
                  [Op.iLike]: `%${autor}%`,
                },
              }
            : undefined,
          required: false,
        },

        {
          model: Tag,
          as: "Tags",
          where: tag
            ? {
                nameTag: {
                  [Op.iLike]: `%${tag}%`,
                },
              }
            : undefined,
          required: false,
        },

        {
          model: Photo,
          as: "Photos",
        },
      ],

      order: [
        [
          "createdAt",
          orden === "antiguas" ? "ASC" : "DESC",
        ],
      ],
    });

    const publicacionesConImagen = publicaciones.map(post => {

      const data = post.toJSON();

      data.portada =
        data.Photos.length > 0
          ? `data:image/jpeg;base64,${Buffer.from(
              data.Photos[0].photo
            ).toString("base64")}`
          : null;

      return data;
    });

    res.render("search/index", {
      publicaciones: publicacionesConImagen,
      filtros: {
        q,
        autor,
        tag,
        orden,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};