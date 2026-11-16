
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
import Report from "./Report.js";

// Un usuario tiene muchas publicaciones
User.hasMany(Post, { foreignKey: "idUser", as: "Posts" });
Post.belongsTo(User, { foreignKey: "idUser", as: "Author" });

// Una publicación tiene muchas etiquetas
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

// Una publicación tiene muchas fotos
Post.hasMany(Photo, { foreignKey: "idPost", as: "Photos" });
Photo.belongsTo(Post, { foreignKey: "idPost", as: "Post" });

// Una foto tiene muchos comentarios
Photo.hasMany(Comment, { foreignKey: "idPhoto", as: "Comments" });
Comment.belongsTo(Photo, { foreignKey: "idPhoto", as: "Photo" });

// Un usuario escribe muchos comentarios
User.hasMany(Comment, { foreignKey: "idUser", as: "Comments" });
Comment.belongsTo(User, { foreignKey: "idUser", as: "Author" });

// Una foto tiene muchas valoraciones
Photo.hasMany(Rating, { foreignKey: "idPhoto", as: "Ratings" });
Rating.belongsTo(Photo, { foreignKey: "idPhoto", as: "Photo" });

// Un usuario hace muchas valoraciones
User.hasMany(Rating, { foreignKey: "idUser", as: "Ratings" });
Rating.belongsTo(User, { foreignKey: "idUser", as: "User" });

// Un usuario puede seguir a muchos usuarios y ser seguido por muchos usuarios
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

// Una publicación puede recibir muchas denuncias
Post.hasMany(Report, {
  foreignKey: "idPost",
  as: "Reports",
});

Report.belongsTo(Post, {
  foreignKey: "idPost",
  as: "Post",
});

// Un usuario puede realizar muchas denuncias
User.hasMany(Report, {
  foreignKey: "idUser",
  as: "Reports",
});

Report.belongsTo(User, {
  foreignKey: "idUser",
  as: "Reporter",
});

export async function connectDatabase() {
  await sequelize.authenticate();
  console.log("Conexión a la base de datos establecida");

  await sequelize.sync();
  console.log("Modelos sincronizados correctamente");
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
  Report,
};
