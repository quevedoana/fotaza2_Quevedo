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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
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
    },
    idPhoto:{
      type:DataTypes.BLOB,
      allowNull: false,
    },
    commentsActive:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  },
  {
    sequelize, 
    tableName: 'Posts',
    timestamps: true,
  },
);
export default Post;

