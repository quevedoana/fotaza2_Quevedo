import bcrypt from "bcrypt";
import { User } from "../models/index.js";

export async function userSeeder() {

  const password = await bcrypt.hash("123456", 10);

  const usuarios = [
    {
      userName: "ana",
      email: "ana@test.com",
      fullName: "Ana Quevedo",
      birthDate: "2000-01-01",
    },
    {
      userName: "juan",
      email: "juan@test.com",
      fullName: "Juan Perez",
      birthDate: "2000-01-01",
    },
    {
      userName: "maria",
      email: "maria@test.com",
      fullName: "Maria Gomez",
      birthDate: "2000-01-01",
    },
  ];

  for (const usuario of usuarios) {

    const [user, created] = await User.findOrCreate({
      where: {
        email: usuario.email,
      },
      defaults: {
        ...usuario,
        password,
      },
    });

    if (created) {
      console.log(`Usuario ${user.userName} creado`);
    } else {
      console.log(`Usuario ${user.userName} ya existía`);
    }
  }
}