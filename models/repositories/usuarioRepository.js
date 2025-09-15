
export class UsuarioRepository {
    constructor() {
        this.usuarios = []
        this.nextId = 1
    }

    crearUsuario(usuario){
        usuario.id = this.nextId
        this.nextId++
        this.usuarios.push(usuario)
        return usuario
    }

    findById(usuarioId){
        return this.usuarios.filter(usuario => usuario.id === usuarioId)[0]
    }
}