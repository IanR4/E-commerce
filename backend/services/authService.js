import {Usuario} from "../models/entities/usuario.js"
import UsuarioRepository from "../models/repositories/usuarioRepository.js";
import UsuarioValidator from "../validators/usuarioValidator.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default class AuthService {
    constructor() {
        this.usuarioRepository = UsuarioRepository;
        this.usuarioValidator = UsuarioValidator;
    }

    postRegister(email, password, nombre, tipo, telefono) {
        const hash = bcrypt.hash(password, SALT_ROUNDS);

        const nuevoUsuario = new Usuario(
            nombre,
            email,
            telefono,
            hash,
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
                const isPasswordValid = bcrypt.compare(password, usuario.password);
                if (!isPasswordValid) {
                    return Promise.reject(new Error('Contraseña incorrecta'));
                }
                return {
                    data: usuario,
                    status: 200
                };
            });
    }
}
