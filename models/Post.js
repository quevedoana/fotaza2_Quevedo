import { Model, DataTypes } from "sequelize";
import sequelize from "../db/config.js"


class Post extends Model {}

Post.init(
  {
    idPost: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique:true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.STRING, 
    },
    idPhoto: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    idUser:{
      type: DataTypes.INTEGER,
      allowNull:false,
      unique: true,
    }
  },
  {
    sequelize, 
    tableName: 'Posts',
    createdAt: true,
  },
);
export default Post;

