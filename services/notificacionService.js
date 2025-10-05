import UsuarioRepository from "../models/repositories/usuarioRepository.js";

export default class NotificacionService {
    constructor() {
        this.usuarioRepository = UsuarioRepository;
    }

    getNotificacionesLeidasUsuario(usuarioId) {
        const usuario = this.usuarioRepository.findById(usuarioId);
        const notificacionesLeidas = usuario.notificaciones.filter(notificacion => notificacion.leida);
        return Promise.resolve(notificacionesLeidas)
        .then((notificacionesRes) => {
            return {
                data: notificacionesRes,
                status: 200
            };
        });
    }

    getNotificacionesNoLeidasUsuario(usuarioId) {
        const usuario = this.usuarioRepository.findById(usuarioId);
        const notificacionesNoLeidas = usuario.notificaciones.filter(notificacion => !notificacion.leida);
        return Promise.resolve(notificacionesNoLeidas)
        .then((notificacionesRes) => {
            return {
                data: notificacionesRes,
                status: 200
            };
        });
    }

    marcarNotificacionComoLeida(usuarioId, notificacionId) {
        const usuario = this.usuarioRepository.findById(usuarioId);
        const notificacion = usuario.notificaciones.find(notificacion => notificacion.id === notificacionId);
        notificacion.marcarComoLeida();
        return Promise.resolve(notificacion)
        .then((notificacionRes) => {
            return {
                data: notificacionRes,
                status: 200
            };
        });
    }
}
