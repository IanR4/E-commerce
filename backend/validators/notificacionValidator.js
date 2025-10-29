import { z } from "zod";
import NotificacionRepository from "../models/repositories/notificacionRepository.js";

class NotificacionValidator {
    constructor(notificacionRepository) {
        this.notificacionRepository = notificacionRepository;
    }

    validarNotificacionId(notificacionId) {
        if (!notificacionId) {
            throw new Error("Invalid notificacionId parameter");
        }
    }

    validarNotificaicon(notificacion) {
        try {
            return notificacionSchema.parse(notificacion);  
        }
        catch(error) {
            throw new Error("Invalid request body", error.errors);
        }
    }

    buscarNotificacion(notificacionId) {
        const notificacion = this.notificacionRepository.findById(notificacionId);
        if(!notificacion) {
            return Promise.reject(new Error("Notificacion no encontrada"));
        }
        return notificacion;
    }

    buscarNotificacionesUsuario(usuarioId) {
        return this.notificacionRepository.findByUser(usuarioId)
            .then(notificaciones => {
                if (!notificaciones) {
                    return Promise.reject(new Error("No se encontraron notificaciones para el usuario"));
                }
                return notificaciones;
            });
    }

    buscarNotificacionesLeidasUsuario(usuarioId) {
        return this.buscarNotificacionesUsuario(usuarioId)
            .then(notificaciones => notificaciones.filter(notificacion => notificacion.leida));
    }

    buscarNotificacionesNoLeidasUsuario(usuarioId) {
        return this.buscarNotificacionesUsuario(usuarioId)
            .then(notificaciones => notificaciones.filter(notificacion => !notificacion.leida));
    }
}

const notificacionSchema = z.object({
    usuarioId: z.number().positive(),
    mensaje: z.string().min(1),
    leida: z.boolean()
})

export default new NotificacionValidator(NotificacionRepository);