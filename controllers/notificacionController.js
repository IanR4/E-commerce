import { z } from "zod"
import NotificacionService from "../services/notificacionService.js";

class NotificacionController {
    constructor() {
        this.notificacionService = new NotificacionService();
    }

    getNotificacionesLeidasUsuario = (req, res, next) => {
        const usuarioId = parseInt(req.params.usuarioId, 10);
        if (isNaN(usuarioId)) {
            return res.status(400).json({ error: "Invalid usuarioId parameter" });
        }
        this.notificacionService.getNotificacionesLeidasUsuario(usuarioId)
            .then(({ data, status }) => res.status(status).json(data))
            .catch(next);
    }

    getNotificacionesNoLeidasUsuario = (req, res, next) => {
        const usuarioId = parseInt(req.params.usuarioId, 10);
        if (isNaN(usuarioId)) {
            return res.status(400).json({ error: "Invalid usuarioId parameter" });
        }
        this.notificacionService.getNotificacionesNoLeidasUsuario(usuarioId)
            .then(({ data, status }) => res.status(status).json(data))
            .catch(next);
    }

    marcarNotificacionComoLeida = (req, res, next) => {
        const usuarioId = parseInt(req.params.usuarioId, 10);
        const notificacionId = parseInt(req.params.notificacionId, 10);
        if (isNaN(usuarioId)) {
            return res.status(400).json({ error: "Invalid usuarioId parameter" });
        }
        if (isNaN(notificacionId)) {
            return res.status(400).json({ error: "Invalid notificacionId parameter" });
        }
        this.notificacionService.marcarNotificacionComoLeida(usuarioId, notificacionId)
            .then(({ data, status }) => res.status(status).json(data))
            .catch(next);
    }
}

export default new NotificacionController();