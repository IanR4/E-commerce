import {Producto} from "../models/entities/producto.js"
import UsuarioRepository from "../models/repositories/usuarioRepository.js";
import ProductoRepository from "../models/repositories/productoRepository.js";

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
        const vendedorId = parseInt(productoData.vendedor, 10);
        const vendedor = UsuarioRepository.findById(vendedorId);
        if(!vendedor) {
            return Promise.reject({name: "NotFoundError", message: "Vendedor no encontrado"});
        }
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