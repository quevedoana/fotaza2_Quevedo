
import bcrypt from "bcrypt";
import { User } from "../models/index.js";

export async function userSeeder() {
  const passwordUsuarios = await bcrypt.hash("123456", 10);

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
        password: passwordUsuarios,
        role: "user",
        active: true,
      },
    });

    console.log(
      created
        ? `Usuario ${user.userName} creado`
        : `Usuario ${user.userName} ya existía`
    );
  }

  const emailModerador = process.env.MODERATOR_EMAIL;
  const passwordModerador = process.env.MODERATOR_PASSWORD;

  if (!emailModerador || !passwordModerador) {
    throw new Error(
      "Faltan MODERATOR_EMAIL y MODERATOR_PASSWORD en el archivo .env"
    );
  }

  const hashModerador = await bcrypt.hash(passwordModerador, 10);

  const [moderador, creado] = await User.findOrCreate({
    where: {
      email: emailModerador.trim().toLowerCase(),
    },
    defaults: {
      userName: "moderador",
      email: emailModerador.trim().toLowerCase(),
      fullName: "Moderador Fotaza",
      birthDate: "1990-01-01",
      password: hashModerador,
      role: "moderator",
      active: true,
    },
  });

  if (!creado) {
    await moderador.update({
      role: "moderator",
      active: true,
    });
  }

  console.log(
    creado
      ? "Cuenta de moderador creada"
      : "Cuenta existente actualizada como moderador"
  );
}
