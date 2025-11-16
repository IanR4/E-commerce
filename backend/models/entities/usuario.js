export class Usuario {
    constructor(nombre, email, telefono, password, tipo) {
        this.nombre = nombre
        this.email = email
        this.telefono = telefono
        this.password = password
        this.tipo = tipo
        this.fechaAlta = new Date()
    }
}