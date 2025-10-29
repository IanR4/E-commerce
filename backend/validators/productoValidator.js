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
        if (!productoId) {
            throw new BadRequestError("Invalid productoId parameter");
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