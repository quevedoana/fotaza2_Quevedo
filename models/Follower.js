import { Model, DataTypes } from "sequelize";
import sequelize from "../db/config.js"


class Follower extends Model {}

Follower.init(
  {
    idFollower: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique:true,
      autoIncrement: true,
    },
    idFollowee: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique:true,
    }
  },
  {
    sequelize, 
    tableName: 'Followers',
    timestamps: true,
  },
);
export default Follower;