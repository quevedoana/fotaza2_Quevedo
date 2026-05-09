import { Model, DataTypes } from "sequelize";
import sequelize from "../db/config.js"


class User extends Model {}

User.init(
  {
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique:true,
      autoIncrement: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, 
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, 
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    profilePhoto: {
      type: DataTypes.BLOB,
    },
    description: {
      type: DataTypes.STRING, 
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    sequelize, 
    tableName: 'Users',
    createdAt: true,
  },
);
export default User;