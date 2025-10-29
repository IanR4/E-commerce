import ProductoService from "../services/productoService.js"
import ProductoValidator from "../validators/productoValidator.js"
import UsuarioValidator from "../validators/usuarioValidator.js";

class ProductoController {
    constructor() {
        this.productoService = new ProductoService();
        this.productoValidator = ProductoValidator;
    }

    getProductos = (req, res) => {
        const { page = 1, limit = 100 } = req.query;

        return this.productoService.getProductos({ page, limit })
            .then(({ data, status }) => res.status(status).json(data))
    }

    getProducto = (req, res) => {
        const productoId = req.params.productoId;
        this.productoValidator.validarProductoId(productoId);
        return this.productoService.getProducto(productoId)
            .then(({ data, status }) => res.status(status).json(data))
    };

    postProducto = (req, res) => {
        const productoData = req.body;
        const resultBody = this.productoValidator.validarProducto(productoData);
        return this.productoService.postProducto(resultBody)
            .then(({ data, status }) => res.status(status).json(data))
    }

    getProductosVendedor = (req, res) => {
        const vendedorId = req.params.vendedorId;
        UsuarioValidator.validarUsuarioId(vendedorId);

        const { page = 1, limit = 9 } = req.query;
        const { titulo, categoria, descripcion, precioMin, precioMax, orden } = req.query;

        // Obtener productos del vendedor y aplicar filtros
        return this.productoService.getProductosPorVendedor(vendedorId, { page, limit }, { titulo, categoria, descripcion, precioMin, precioMax, orden })
            .then(({ data, status }) => res.status(status).json(data))
    }
}

export default new ProductoController();