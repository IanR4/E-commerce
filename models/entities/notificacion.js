export class Notificacion {
    constructor(id, usuarioDestino, mensaje) {
        this.id = id
        this.usuarioDestino = usuarioDestino
        this.mensaje = mensaje 
        this.fechaAlta = new Date()
        this.leida = false
        this.fechaLeida = null
    }

    marcarComoLeida() {
        this.leida = true
    }
}
