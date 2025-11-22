import express from "express";
import NotificacionController from "../controllers/notificacionController.js";

export default function notificacionRoutes() {
    const router = express.Router();
    const pathNotificaciones = "/usuarios/:usuarioId/notificaciones";

    router.get(`${pathNotificaciones}/leidas`, (req, res, next) => {
        NotificacionController
            .getNotificacionesLeidasUsuario(req, res)
            .catch(next);
    });

    router.get(`${pathNotificaciones}/noleidas`, (req, res, next) => {
        NotificacionController
            .getNotificacionesNoLeidasUsuario(req, res)
            .catch(next);
    });

    router.patch("/notificacion/:notificacionId", (req, res, next) => {
        NotificacionController
            .marcarNotificacionComoLeida(req, res)
            .catch(next);
    });

    return router;
}