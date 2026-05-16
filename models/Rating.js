import { Model, DataTypes } from "sequelize";
import sequelize from "../db/config.js"


class Rating extends Model {}

Rating.init(
  {
    idRating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique:true,
      autoIncrement: true,
    },
    idPhoto: {
      type: DataTypes.INTEGER, 
    },
    idUser:{
      type: DataTypes.INTEGER,
      allowNull: false,
    }, 
    score:{
        type: DataTypes.INTEGER,
        allowNull:false,
    } 
  },
  {
    sequelize, 
    tableName: 'Ratings',
    timestamps: true,
  },
);
export default Rating;