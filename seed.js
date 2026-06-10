import { connectDatabase } from "./models/index.js";
import { userSeeder } from "./seeders/userSeeder.js";

try {

  await connectDatabase();

  await userSeeder();

  console.log("Seeder ejecutado correctamente");

} catch (err) {

  console.error(err);

} finally {

  process.exit();
}