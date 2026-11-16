
import { Model, DataTypes } from "sequelize";
import sequelize from "../db/config.js";

class Rating extends Model {}

Rating.init(
  {
    idRating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },

    idPhoto: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
        isInt: true,
      },
    },
  },
  {
    sequelize,
    tableName: "Ratings",
    timestamps: true,

    // Impedir que un usuario tenga más de una valoración
    // para la misma foto.
    indexes: [
      {
        unique: true,
        fields: ["idPhoto", "idUser"],
      },
    ],
  }
);

export default Rating;
