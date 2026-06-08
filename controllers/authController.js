import bcrypt from "bcrypt";
import { User } from "../models/index.js";

export const getLogin = (req, res) => {
  res.render("auth/login");
};

export const getRegister = (req, res) => {
  res.render("auth/register");
};

export const postRegister = async (req, res) => {
  try {
    const { email, password, fecha, nombre, usuario } = req.body;

    const existeEmail = await User.findOne({
      where: { email },
    });

    if (existeEmail) {
      return res.render("auth/register", {
        error: "Ya existe una cuenta con ese email",
      });
    }

    const existeUsuario = await User.findOne({
      where: { userName: usuario },
    });

    if (existeUsuario) {
      return res.render("auth/register", {
        error: "Ese nombre de usuario ya está en uso",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hash,
      birthDate: fecha,
      fullName: nombre,
      userName: usuario,
    });

    res.redirect("/login");

  } catch (err) {
    console.error(err);

    return res.render("auth/register", {
      error: "Ocurrió un error al registrarse",
    });
  }
};

export const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.render("auth/login", {
        error: "El usuario o contraseña son incorrectos",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.render("auth/login", {
        error: "El usuario o contraseña son incorrectos",
      });
    }

    req.session.user = {
      idUser: user.idUser,
      userName: user.userName,
    };

    res.redirect("/");

  } catch (err) {
    console.error(err);
    res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
