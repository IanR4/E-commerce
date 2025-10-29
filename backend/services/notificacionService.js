import UsuarioRepository from "../models/repositories/usuarioRepository.js";
import UsuarioValidator from "../validators/usuarioValidator.js"
import NotificacionValidator from "../validators/notificacionValidator.js"
import NotificacionRepository from "../models/repositories/notificacionRepository.js";

export default class NotificacionService {
    constructor() {
        this.usuarioRepository = UsuarioRepository;
        this.usuarioValidator = UsuarioValidator;
        this.notificacionValidator = NotificacionValidator;
        this.notificacionRepository = NotificacionRepository;
    }

    getNotificacionesLeidasUsuario(usuarioId) {
        this.usuarioValidator.buscarUsuario(usuarioId);

        return Promise.resolve(this.notificacionValidator.buscarNotificacionesLeidasUsuario(usuarioId))
        .then((listaPedidos) => {
            return {
                data: listaPedidos,
                status: 200
            };
        });
    }

    getNotificacionesNoLeidasUsuario(usuarioId) {
        this.usuarioValidator.buscarUsuario(usuarioId);

        return Promise.resolve(this.notificacionValidator.buscarNotificacionesNoLeidasUsuario(usuarioId))
        .then((listaNotificaciones) => {
            return {
                data: listaNotificaciones,
                status: 200
            };
        });
    }

    marcarNotificacionComoLeida(notificacionId) {
        return this.notificacionValidator.buscarNotificacion(notificacionId)
            .then(notificacion => {
                notificacion.marcarComoLeida();
                return this.notificacionRepository.actualizarNotificacion(notificacionId, {
                    leida: notificacion.leida,
                    fechaLeida: notificacion.fechaLeida
                });
            })
            .then(notificacionActualizada => {
                return {
                    data: notificacionActualizada,
                    status: 200
                };
            });
    }
}
