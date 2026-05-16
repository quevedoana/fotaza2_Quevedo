import { Model, DataTypes } from "sequelize";
import sequelize from "../db/config.js"


class Comment extends Model {}

Comment.init(
  {
    idComment: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique:true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    idUser:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idPhoto:{
      type:DataTypes.INTEGER,
      allowNull:false,
    }   
  },
  {
    sequelize, 
    tableName: 'Comments',
    timestamps: true,
  },
);
export default Comment;