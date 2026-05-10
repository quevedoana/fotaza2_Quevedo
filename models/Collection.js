import { Model, DataTypes } from "sequelize";
import sequelize from "../db/config.js"


class Collection extends Model {}

Collection.init(
  {
    idCollection: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique:true,
      autoIncrement: true,
    },
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique:true,
    },
    name: {
        type:DataTypes.STRING,
        allowNull: null,
    },
  },
  {
    sequelize, 
    tableName: 'Collections',
    createdAt: true,
    updatedAt: true,
  },
);
export default Collection;