import { Model, DataTypes } from "sequelize";
import sequelize from "../db/config.js"


class Tag extends Model {}

Tag.init(
  {
    idTag: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique:true,
      autoIncrement: true,
    },
    nameTag: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize, 
    tableName: 'Tags',
    createdAt: false,
    deletedAt: false,
  },
);
export default Tag;