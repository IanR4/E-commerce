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
        return this.usuarioRepository.crearUsuario(nuevoUsuario)
            .then(usuarioGuardado => ({
                data: usuarioGuardado,
                status: 201
            }));
    }


    getUsuarioLogin(usuarioData){
        return Promise.resolve(this.usuarioValidator.buscarUsuarioLogin(usuarioData))
        .then((usuarioRes) => {
            return {
                data: usuarioRes,
                status: 200
            };
        });
    }
}
