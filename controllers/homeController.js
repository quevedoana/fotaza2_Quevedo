import { User, Post, Photo, Rating } from "../models/index.js";
import sequelize from "../db/config.js";

// Prepara las publicaciones, sus imágenes y sus valoraciones
const prepararPublicaciones = (posts) => {
  return posts.map((post) => {
    const data = post.toJSON();

    let sumaRatings = 0;
    let cantidadRatings = 0;

    data.Photos.forEach((foto) => {
      const valoraciones = foto.Ratings || [];

      valoraciones.forEach((rating) => {
        const puntaje = Number(rating.score);

        if (Number.isFinite(puntaje)) {
          sumaRatings += puntaje;
          cantidadRatings++;
        }
      });
    });

    data.promedioRating =
      cantidadRatings > 0
        ? (sumaRatings / cantidadRatings).toFixed(1)
        : null;

    data.cantidadValoraciones = cantidadRatings;

    data.portada =
      data.Photos.length > 0 && data.Photos[0].photo
        ? `data:image/jpeg;base64,${Buffer.from(
            data.Photos[0].photo
          ).toString("base64")}`
        : null;

    return data;
  });
};

// Relaciones necesarias para traer las publicaciones
const incluirDatos = () => [
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
    model: User,
    as: "Author",
  },
];

export const index = async (req, res) => {
  try {
    let posts = [];

    // Visitantes sin sesión
    if (!req.session.user) {
      posts = await Post.findAll({
        include: incluirDatos(),
        order: sequelize.literal("RANDOM()"),
        limit: 12,
      });

      return res.render("index", {
        posts: prepararPublicaciones(posts),
        feed: false,
      });
    }

    // Obtener las personas que sigue el usuario
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

    const idsSeguidos = usuario
      ? usuario.Following.map((u) => u.idUser)
      : [];

    if (idsSeguidos.length > 0) {
      posts = await Post.findAll({
        where: {
          idUser: idsSeguidos,
        },
        include: incluirDatos(),
        order: [["createdAt", "DESC"]],
      });
    } else {
      posts = await Post.findAll({
        include: incluirDatos(),
        order: sequelize.literal("RANDOM()"),
        limit: 12,
      });
    }

    res.render("index", {
      posts: prepararPublicaciones(posts),
      feed: true,
      siguePersonas: idsSeguidos.length > 0,
    });

  } catch (err) {
    console.error("Error al cargar el inicio:", err);
    res.status(500).send("Error al cargar las publicaciones");
  }
};