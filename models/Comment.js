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
    userId:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },   
  },
  {
    sequelize, 
    tableName: 'Comments',
    createdAt: true,
  },
);
export default Comment;