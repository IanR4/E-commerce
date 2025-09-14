import {Usuario} from "../models/entities/pedido.js"
import { UsuarioRepository } from "../models/repositories/pedidoRepository.js";

export default class UsuarioService {
    constructor() {
        this.usuarioRepository = new UsuarioRepository();
    }

    getUsuario(usuarioId){
        return Promise.all([this.usuarioRepository.findById(usuarioId)])
        .then((usuarioRes) => {
            return {
                data: {
                    usuario: usuarioRes
                },
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
