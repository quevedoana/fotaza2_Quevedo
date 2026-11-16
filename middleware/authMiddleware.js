
import { User } from "../models/index.js";

export const authMiddleware = async (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  try {
    const user = await User.findByPk(req.session.user.idUser);

    if (!user || !user.active) {
      return req.session.destroy(() => {
        res.redirect("/login");
      });
    }

    // Actualizamos el rol de la sesión desde la base de datos
    req.session.user.role = user.role;
    req.session.user.userName = user.userName;

    next();
  } catch (err) {
    console.error("Error al verificar la sesión:", err);
    res.status(500).send("Error al verificar la sesión");
  }
};
