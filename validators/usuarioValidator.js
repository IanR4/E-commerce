import { z } from "zod";
import { BadRequestError, NotFoundError, ValidationError, StockError } from "../errors/errors.js";
import UsuarioRepository from "../models/repositories/usuarioRepository.js";
import { TipoUsuario } from "../models/entities/tipoUsuario.js";

class UsuarioValidator {
    constructor() {
        this.usuarioRepository = UsuarioRepository;
    }

    validarUsuarioId(usuarioId) {
        if (!usuarioId) {
            throw new BadRequestError("Invalid usuarioId parameter");
        }
    }

    validarUsuario(usuario) {
        try {
            return usuarioSchema.parse(usuario);
        }
        catch(error) {
            throw new ValidationError("Invalid request body", error.errors);
        }
    }

    buscarUsuario(usuarioId) {
        const usuario = this.usuarioRepository.findById(usuarioId);
        if(!usuario) {
            return Promise.reject(new NotFoundError("Usuario no encontrado"));
        }
        return usuario;
    }

    buscarComprador(compradorId) {
        const comprador = this.usuarioRepository.findById(compradorId);
        if(!comprador) {
            return Promise.reject(new NotFoundError("Comprador no encontrado"));
        }
        return comprador;
    }

    buscarVendedor(vendedorId) {
        const vendedor = this.usuarioRepository.findById(vendedorId);
        if(!vendedor) {
            return Promise.reject(new NotFoundError("Vendedor no encontrado"));
        }
        return vendedor;
    }
}

const usuarioSchema = z.object({
    nombre: z.string().min(3).max(20),
    email: z.string().email(),
    telefono: z.string().min(8).max(15),
    tipo: z.nativeEnum(TipoUsuario)
})

export default new UsuarioValidator();