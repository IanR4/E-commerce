export class Usuario {
    constructor(nombre, email, telefono, tipo) {
        this.nombre = nombre
        this.email = email
        this.telefono = telefono
        this.tipo = tipo
        this.fechaAlta = new Date()
    }
}