export class Notificacion {
    constructor(usuarioDestino, mensaje) {
        this.usuarioDestino = usuarioDestino
        this.mensaje = mensaje 
        this.fechaAlta = new Date()
        this.leida = false
        this.fechaLeida = null
    }
/*
    marcarComoLeida() {
        if(!this.leida) {
            this.leida = true
            this.fechaLeida = new Date()
        }
    }
*/
}
