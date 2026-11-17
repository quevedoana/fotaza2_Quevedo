
export const moderatorMiddleware = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  if (req.session.user.role !== "moderator") {
    return res.status(403).send("No tenés permisos para acceder a esta sección.");
  }

  next();
};
