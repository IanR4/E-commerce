export class Usuario {
    constructor(nombre, email, telefono, tipo) {
        this.nombre = nombre
        this.email = email
        this.telefono = telefono
        this.tipo = tipo
        this.fechaAlta = new Date()

        this.notificaciones = []
        this.nextNotificacionId = 1
    }

    recibirNotificacion(notificacion) {
        notificacion.id = this.nextId
        this.nextNotificacionId++

        this.notificaciones.push(notificacion)
    }
}