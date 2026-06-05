import { User, Post, Photo } from "../models/index.js";

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

    res.render("users/profile", {
      userProfile: userData,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};