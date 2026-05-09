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
      autoIncrement: true,
    }
  },
  {
    sequelize, 
    tableName: 'Followers',
    createdAt: true,
    deletedAt: false,
  },
);
export default Follower;