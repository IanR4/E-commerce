import { z } from "zod";
import { Moneda } from "../models/entities/moneda.js";
import { BadRequestError, NotFoundError, ValidationError, StockError } from "../errors/errors.js";
import UsuarioRepository from "../models/repositories/usuarioRepository.js";
import ProductoRepository from "../models/repositories/pedidoRepository.js";

class ProductoValidator {
    constructor() {
        this.productoRepository = ProductoRepository;
        this.usuarioRepository = UsuarioRepository;
    }

    validarProductoId(productoId) {
        if (isNaN(productoId)) {
            throw new BadRequestError("Invalid productoId parameter");
        }
    }

    validarUsuarioId(usuarioId) {
        if (isNaN(usuarioId)) {
            throw new BadRequestError("Invalid usuarioId parameter");
        }
    }

    validarProducto(producto) {
        try {
            return productoSchema.parse(producto);
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

    buscarVendedor(vendedorId) {
        const vendedor = this.usuarioRepository.findById(vendedorId);
        if(!vendedor) {
            return Promise.reject(new NotFoundError("Vendedor no encontrado"));
        }
        return vendedor;
    }

    buscarProducto(productoId) {
        const producto = this.productoRepository.findById(productoId);
        if(!producto) {
            return Promise.reject(new NotFoundError("Producto no encontrado"));
        }
        return producto;
    }
}

const productoSchema = z.object({
    vendedor: z.string().min(1),
    titulo: z.string().min(1),
    descripcion: z.string().min(1),
    categorias: z.array(z.string().min(1)),
    precio: z.number().nonnegative(),
    moneda: z.nativeEnum(Moneda),
    stock: z.number().nonnegative(),
    fotos: z.array(z.string().url())
})


export default new ProductoValidator();