export class Notificacion {
    constructor(id, usuarioDestino, mensaje, fechaAlta, fechaLeida) {
        this.id = id
        this.usuarioDestino = usuarioDestino
        this.mensaje = mensaje 
        this.fechaAlta = fechaAlta
        this.leida = false
        this.fechaLeida = fechaLeida
    }

    marcarComoLeida() {
        this.leida = true
    }
}