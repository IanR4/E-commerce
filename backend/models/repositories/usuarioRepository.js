import { UsuarioModel } from '../../schemas/usuarioSchema.js';

class UsuarioRepository {
    constructor() {
        this.model = UsuarioModel;
    }

    crearUsuario(usuario){
        const nuevoUsuario = new this.model(usuario);
        return nuevoUsuario.save();
    }

    findById(usuarioId){
        return this.model.findOne({ _id: usuarioId }).exec();
    }

    findByUser(email, password){
        return this.model.findOne({ email: email, password: password }).exec();
    }
}

export default new UsuarioRepository();