import {Producto} from "../models/entities/producto.js"
import UsuarioRepository from "../models/repositories/usuarioRepository.js";
import ProductoRepository from "../models/repositories/productoRepository.js";
import ProductoValidator from "../validators/productoValidator.js"
import UsuarioValidator from "../validators/usuarioValidator.js"

export default class ProductoService {

    getProductos(datosPaginacion) {
        const { page, limit } = datosPaginacion
        const numeroPagina = Math.max(Number(page), 1)
        const elementosPorPagina = Math.min(Math.max(Number(limit), 1), 100)
        const offset = (numeroPagina - 1) * elementosPorPagina

        return Promise.resolve(ProductoRepository.findAll())
        .then((productosRes) => {
            const cantidadTotal = productosRes.length
            const totalPaginas = Math.ceil(cantidadTotal / elementosPorPagina)

            return {
                data: {
                    pagina: numeroPagina,
                    entradasPagina: elementosPorPagina,
                    cantidadTotal: cantidadTotal,
                    totalPaginas: totalPaginas,
                    productos: productosRes.slice(offset, offset + elementosPorPagina)
                },
                status: 200
            };
        });
    }


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
        const vendedorId = productoData.vendedor;
        UsuarioValidator.validarUsuarioId(vendedorId);

        return UsuarioValidator.buscarVendedor(vendedorId)
            .then(vendedor => {
                const nuevoProducto = new Producto(
                    vendedor._id, 
                    productoData.titulo,
                    productoData.descripcion,
                    productoData.categorias,
                    productoData.precio,
                    productoData.moneda,
                    productoData.stock,
                    productoData.foto
                );
                return ProductoRepository.crearProducto(nuevoProducto);
            })
            .then(productoGuardado => ({
                data: productoGuardado,
                status: 201
            }));
    }

    getProductosPorVendedor(vendedorId, datosPaginacion, filtros) {
        const { page, limit } = datosPaginacion
        const numeroPagina = Math.max(Number(page), 1)
        const elementosPorPagina = Math.min(Math.max(Number(limit), 1), 100)
        const offset = (numeroPagina - 1) * elementosPorPagina

        return Promise.resolve(ProductoRepository.findByVendedor(vendedorId, filtros))
        .then((productosRes) => {
            const cantidadTotal = productosRes.length
            const totalPaginas = Math.ceil(cantidadTotal / elementosPorPagina)

            return {
                data: {
                    pagina: numeroPagina,
                    entradasPagina: elementosPorPagina,
                    cantidadTotal: cantidadTotal,
                    totalPaginas: totalPaginas,
                    productos: productosRes.slice(offset, offset + elementosPorPagina)
                },
                status: 200
            };
        });
    }
}