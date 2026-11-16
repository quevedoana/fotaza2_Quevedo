
import { Model, DataTypes } from "sequelize";
import sequelize from "../db/config.js";

class Report extends Model {}

Report.init(
  {
    idReport: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    idPost: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    tableName: "Reports",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["idPost", "idUser"],
      },
    ],
  }
);

export default Report;
