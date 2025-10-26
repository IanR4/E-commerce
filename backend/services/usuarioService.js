import {Usuario} from "../models/entities/usuario.js"
import UsuarioRepository from "../models/repositories/usuarioRepository.js";

export default class UsuarioService {
    constructor() {
        this.usuarioRepository = UsuarioRepository;
    }

    getUsuario(usuarioId){
        return Promise.resolve(this.usuarioRepository.findById(usuarioId))
        .then((usuarioRes) => {
            return {
                data: usuarioRes,
                status: 200
            };
        });
    }
    
    postUsuario(usuarioData){
        const nuevoUsuario = new Usuario(
            usuarioData.nombre,
            usuarioData.email,
            usuarioData.telefono,
            usuarioData.tipo,
        )
        const usuarioGuardado = this.usuarioRepository.crearUsuario(nuevoUsuario);
        return Promise.resolve({
            data: usuarioGuardado,
            status: 201
        });
    }
}
