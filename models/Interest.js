import { Model, DataTypes } from "sequelize";
import sequelize from "../db/config.js"


class Interest extends Model {}

Interest.init(
  {
    idInterest: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique:true,
      autoIncrement: true,
    },
    idPhoto: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idUser:{
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    sequelize, 
    tableName: 'Interests',
    createdAt: true,
    deletedAt: false,
  },
);
export default Interest;