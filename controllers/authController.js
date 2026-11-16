
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

    if (
      !email?.trim() ||
      !password?.trim() ||
      !fecha?.trim() ||
      !nombre?.trim() ||
      !usuario?.trim()
    ) {
      return res.render("auth/register", {
        error: "Todos los campos son obligatorios",
      });
    }

    const emailLimpio = email.trim().toLowerCase();
    const usuarioLimpio = usuario.trim();

    const existeEmail = await User.findOne({
      where: { email: emailLimpio },
    });

    if (existeEmail) {
      return res.render("auth/register", {
        error: "Ya existe una cuenta con ese email",
      });
    }

    const existeUsuario = await User.findOne({
      where: { userName: usuarioLimpio },
    });

    if (existeUsuario) {
      return res.render("auth/register", {
        error: "Ese nombre de usuario ya está en uso",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    await User.create({
      email: emailLimpio,
      password: hash,
      birthDate: fecha,
      fullName: nombre.trim(),
      userName: usuarioLimpio,
      role: "user",
      active: true,
    });

    res.redirect("/login");
  } catch (err) {
    console.error("Error al registrarse:", err);

    return res.render("auth/register", {
      error: "Ocurrió un error al registrarse",
    });
  }
};

export const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email: email?.trim().toLowerCase(),
      },
    });

    if (!user) {
      return res.render("auth/login", {
        error: "El usuario o contraseña son incorrectos",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.render("auth/login", {
        error: "El usuario o contraseña son incorrectos",
      });
    }

    if (!user.active) {
      return res.render("auth/login", {
        error: "Tu cuenta se encuentra desactivada. Contactá con moderación.",
      });
    }

    req.session.user = {
      idUser: user.idUser,
      userName: user.userName,
      role: user.role,
    };

    res.redirect("/");
  } catch (err) {
    console.error("Error al iniciar sesión:", err);
    res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
