import "dotenv/config";
import sequelize from "./db/config.js";
import { connectDatabase } from "./models/index.js";
import { userSeeder } from "./seeders/UserSeeder.js";

try {
  await connectDatabase();

  await userSeeder();

  console.log("Seeder ejecutado correctamente");
} catch (err) {
  console.error("Error al ejecutar el seeder:", err);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}