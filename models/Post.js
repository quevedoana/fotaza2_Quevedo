import { Model, DataTypes } from "sequelize";
import sequelize from "../db/config.js"


class Post extends Model {}

Post.init(
  {
    idPost: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING, 
    },
    idUser:{
      type: DataTypes.INTEGER,
      allowNull:false,
    },
  },
  {
    sequelize, 
    tableName: 'Posts',
    timestamps: true,
  },
);
export default Post;

