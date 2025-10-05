import {Usuario} from "../models/entities/usuario.js"
import UsuarioRepository from "../models/repositories/usuarioRepository.js";
import UsuarioValidator from "../validators/usuarioValidator.js"

export default class UsuarioService {
    constructor() {
        this.usuarioRepository = UsuarioRepository;
        this.usuarioValidator = UsuarioValidator;
    }

    getUsuario(usuarioId){
        return Promise.resolve(this.usuarioValidator.buscarUsuario(usuarioId))
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
