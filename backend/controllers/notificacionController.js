import UsuarioValidator from "../validators/usuarioValidator.js"
import NotificacionValidator from "../validators/notificacionValidator.js"
import NotificacionService from "../services/notificacionService.js";

class NotificacionController {
    constructor() {
        this.usuarioValidator = UsuarioValidator;
        this.notificacionValidator = NotificacionValidator;
        this.notificacionService = new NotificacionService();
    }

    getNotificacionesLeidasUsuario = (req, res) => {
        const usuarioId = req.params.usuarioId;
        this.usuarioValidator.validarUsuarioId(usuarioId);
        return this.notificacionService.getNotificacionesLeidasUsuario(usuarioId)
            .then(({ data, status }) => res.status(status).json(data))
    }

    getNotificacionesNoLeidasUsuario = (req, res) => {
        const usuarioId = req.params.usuarioId;
        this.usuarioValidator.validarUsuarioId(usuarioId);
        return this.notificacionService.getNotificacionesNoLeidasUsuario(usuarioId)
            .then(({ data, status }) => res.status(status).json(data))
    }

    marcarNotificacionComoLeida = (req, res) => {
        const notificacionId = req.params.notificacionId;
        this.notificacionValidator.validarNotificacionId(notificacionId);
        return this.notificacionService.marcarNotificacionComoLeida(notificacionId)
            .then(({ data, status }) => res.status(status).json(data))
    }
}

export default new NotificacionController();