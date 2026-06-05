import { Model, DataTypes } from "sequelize";
import sequelize from "../db/config.js"

class Follower extends Model {}

Follower.init(
  {
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },

    followeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    sequelize,
    tableName: "Followers",
    timestamps: true,
  }
);

export default Follower;