import { Model, DataTypes } from "sequelize";
import sequelize from "../db/config.js"


class Photo extends Model {}

Photo.init(
  {
    idPhoto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique:true,
      autoIncrement: true,
    },
    copyright: {
      type: DataTypes.BOOLEAN,
      allowNull: false, 
    },
    postId:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },   
  },
  {
    sequelize, 
    tableName: 'Photos',
    createdAt: true,
  },
);
export default Photo;