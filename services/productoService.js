import {Producto} from "../models/entities/producto.js"
import UsuarioRepository from "../models/repositories/usuarioRepository.js";
import ProductoRepository from "../models/repositories/productoRepository.js";
import ProductoValidator from "../validators/productoValidator.js"
import UsuarioValidator from "../validators/usuarioValidator.js"

export default class ProductoService {

    getProducto(productoId) {
        return Promise.resolve(ProductoRepository.findById(productoId))
        .then((productoRes) => {
            return {
                data: productoRes,
                status: 200
            };
        });
    }

    postProducto(productoData) {
        const vendedorId = UsuarioValidator.validarUsuarioId(parseInt(productoData.vendedor, 10))
        const vendedor = UsuarioValidator.buscarVendedor(vendedorId)
        const nuevoProducto = new Producto(
            vendedor,
            productoData.titulo,
            productoData.descripcion,
            productoData.categorias,
            productoData.precio,
            productoData.moneda,
            productoData.stock,
            productoData.fotos
        )
        const productoGuardado = ProductoRepository.crearProducto(nuevoProducto);
        return Promise.resolve({
            data: productoGuardado,
            status: 201
        });
    }
}