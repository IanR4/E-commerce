import { NotificacionModel } from '../../schemas/notificacionSchema.js';

class NotificacionRepository {
    constructor() {
        this.model = NotificacionModel;
    }

    crearNotificacion(notificacionData) {
        const nuevaNotificacion = new this.model(notificacionData);
        return nuevaNotificacion.save();
    }

    findById(notificacionId) {
        return this.model.findOne({ _id: notificacionId }).exec();
    }

    actualizarNotificacion(notificacionId, notificacion) {
        return this.model.findByIdAndUpdate(notificacionId, notificacion, { new: true }).exec();
    }

    findByUser(usuarioId) {
        return this.model.find({ usuario: usuarioId }).exec();
    }
}

export default new NotificacionRepository();