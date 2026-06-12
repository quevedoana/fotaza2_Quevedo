import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
    dialect: 'postgres',
    host:process.env.DB_HOST,
    username:process.env.DB_USER,
    database:process.env.DB_NAME,
    password:process.env.DB_PASSWORD,
    port: process.env.DB_PORT,

      dialectOptions:
    process.env.NODE_ENV === "production"
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
})



export default sequelize