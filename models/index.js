import sequelize from "../db/config.js";
import User from "./User.js";
import Post from "./Post.js";
import Comment from "./Comment.js";
import Follower from "./Follower.js";
import Collection from "./Collection.js";
import Interest from "./Interest.js";
import Photo from "./Photo.js";
import Rating from "./Rating.js";
import Tag from "./Tag.js";

//un usuario tiene muchas publicaciones
User.hasMany(Post, { foreignKey: "idUser", as: "Posts" });
Post.belongsTo(User, { foreignKey: "idUser", as: "Author" });

//una publicación tiene muchas etiquetas y una etiqueta pertenece a muchas publicaciones
Post.belongsToMany(Tag, {
  through: "PostTags",
  foreignKey: "idPost",
  otherKey: "idTag",
  as: "Tags",
});
Tag.belongsToMany(Post, {
  through: "PostTags",
  foreignKey: "idTag",
  otherKey: "idPost",
  as: "Posts",
});

//una publicación tiene muchas fotos
Post.hasMany(Photo, { foreignKey: "idPost", as: "Photos" });
Photo.belongsTo(Post, { foreignKey: "idPost", as: "Post" });

//una foto tiene muchos comentarios
Photo.hasMany(Comment, { foreignKey: "idPhoto", as: "Comments" });
Comment.belongsTo(Photo, { foreignKey: "idPhoto", as: "Photo" });

//un usuario escribe muchos comentarios
User.hasMany(Comment, { foreignKey: "idUser", as: "Comments" });
Comment.belongsTo(User, { foreignKey: "idUser", as: "Author" });

//una foto tiene muchas valoraciones
Photo.hasMany(Rating, { foreignKey: "idPhoto", as: "Ratings" });
Rating.belongsTo(Photo, { foreignKey: "idPhoto", as: "Photo" });

//un usuario hace muchas valoraciones
User.hasMany(Rating, { foreignKey: "idUser", as: "Ratings" });
Rating.belongsTo(User, { foreignKey: "idUser", as: "User" });

//un usuario puede seguir a muchos usuarios y ser seguido por muchos usuarios
User.belongsToMany(User, {
  through: Follower,
  as: "Following",
  foreignKey: "followerId",
  otherKey: "followeeId",
});
User.belongsToMany(User, {
  through: Follower,
  as: "Followers",
  foreignKey: "followeeId",
  otherKey: "followerId",
});

export async function connectDatabase() {
  try {
    await sequelize.authenticate();
    console.log("conexion a bd establecida");
    await sequelize.sync({ alter: true });
    console.log("sincronizando los modelos");
  } catch (err) {
    console.error("error en la conexion a la bd", err);
  }
}

export {
  User,
  Post,
  Comment,
  Follower,
  Collection,
  Interest,
  Photo,
  Rating,
  Tag,
};
