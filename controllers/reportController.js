
import { Report, Post, User } from "../models/index.js";

// Mostrar todas las denuncias
export const index = async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [
        {
          model: Post,
          as: "Post",
          include: [
            {
              model: User,
              as: "Author",
            },
          ],
        },
        {
          model: User,
          as: "Reporter",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.render("moderation/index", { reports });
  } catch (error) {
    console.error("Error al cargar las denuncias:", error);
    res.status(500).send("Error al cargar las denuncias");
  }
};

// Crear una denuncia
export const crear = async (req, res) => {
  try {
    const { idPost } = req.params;
    const { reason, description } = req.body;
    const idUser = req.session.user.idUser;

    if (!reason) {
      return res.status(400).send("Tenés que seleccionar un motivo.");
    }

    const post = await Post.findByPk(idPost);

    if (!post) {
      return res.status(404).send("Publicación no encontrada.");
    }

    if (Number(post.idUser) === Number(idUser)) {
      return res.status(403).send("No podés denunciar tu propia publicación.");
    }

    const existingReport = await Report.findOne({
      where: { idPost, idUser },
    });

    if (existingReport) {
      return res.status(409).send("Ya denunciaste esta publicación.");
    }

    await Report.create({
      idPost,
      idUser,
      reason,
      description: description || null,
      status: "pending",
    });

    res.redirect(`/publicaciones/${idPost}`);
  } catch (error) {
    console.error("Error al crear la denuncia:", error);
    res.status(500).send("Error al enviar la denuncia.");
  }
};

// Aceptar una denuncia
export const aceptar = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.idReport);

    if (!report) {
      return res.status(404).send("Denuncia no encontrada");
    }

    if (report.status !== "pending") {
      return res.status(400).send("Esta denuncia ya fue resuelta.");
    }

    report.status = "accepted";
    await report.save();

    res.redirect("/moderacion");
  } catch (error) {
    console.error("Error al aceptar la denuncia:", error);
    res.status(500).send("Error al aceptar la denuncia");
  }
};

// Rechazar una denuncia
export const rechazar = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.idReport);

    if (!report) {
      return res.status(404).send("Denuncia no encontrada");
    }

    if (report.status !== "pending") {
      return res.status(400).send("Esta denuncia ya fue resuelta.");
    }

    report.status = "rejected";
    await report.save();

    res.redirect("/moderacion");
  } catch (error) {
    console.error("Error al rechazar la denuncia:", error);
    res.status(500).send("Error al rechazar la denuncia");
  }
};
