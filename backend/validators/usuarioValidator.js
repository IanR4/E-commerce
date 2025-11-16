import { z } from "zod";
import mongoose from "mongoose";
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
        if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
            throw new BadRequestError("Invalid usuarioId format");
        }
    }

    validarUsuario(usuarioBody) {
        try {
            return usuarioSchema.parse(usuarioBody);
        }
        catch(error) {
            throw new ValidationError("Invalid request body", error.errors);
        }
    }

    buscarUsuario(usuarioId) {
        return this.usuarioRepository.findById(usuarioId)
            .then(usuario => {
                if (!usuario) {
                    throw new NotFoundError("Usuario no encontrado");
                }
                return usuario;
            });
    }

    buscarUsuarioLogin(usuarioData) {
        return this.usuarioRepository.findByUser(usuarioData)
            .then(usuario => {
                if (!usuario) {
                    throw new NotFoundError("Mail no encontrado");
                }
                return usuario;
            });
    }

    buscarComprador(compradorId) {
        return this.usuarioRepository.findById(compradorId)
            .then(comprador => {
                if (!comprador) {
                    throw new NotFoundError("Comprador no encontrado");
                }
                return comprador;
            });
    }

    buscarVendedor(vendedorId) {
        return this.usuarioRepository.findById(vendedorId)
            .then(vendedor => {
                if (!vendedor) {
                    throw new NotFoundError("Vendedor no encontrado");
                }
                return vendedor;
            });
    }
}

const usuarioSchema = z.object({
    nombre: z.string().min(3).max(20),
    email: z.string().email(),
    telefono: z.string().min(8).max(15),
    password: z.string().min(3).max(100),
    tipo: z.nativeEnum(TipoUsuario)
})

export default new UsuarioValidator();