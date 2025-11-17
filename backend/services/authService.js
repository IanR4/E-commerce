import {Usuario} from "../models/entities/usuario.js"
import UsuarioRepository from "../models/repositories/usuarioRepository.js";
import UsuarioValidator from "../validators/usuarioValidator.js"

const SALT_ROUNDS = 10;
 
export default class AuthService {
    constructor() {
        this.usuarioRepository = UsuarioRepository;
        this.usuarioValidator = UsuarioValidator;
    }

    postRegister(email, password, nombre, tipo, telefono) {

        const nuevoUsuario = new Usuario(
            nombre,
            email,
            telefono,
            password,
            tipo,
        )

        return this.usuarioRepository.crearUsuario(nuevoUsuario)
            .then(usuarioGuardado => ({
                data: usuarioGuardado,
                status: 201
            }));
    }

    postLogin(email, password) {
        return this.usuarioRepository.findByUser(email, password)
            .then(usuario => {
                if (!usuario) {
                    return Promise.reject(new Error('Usuario no encontrado'));
                }
                return {
                    data: usuario,
                    status: 200
                };
            });
    }
}
