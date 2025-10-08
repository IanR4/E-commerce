import ProductoService from "../services/productoService.js"
import ProductoValidator from "../validators/productoValidator.js"

class ProductoController {
    constructor() {
        this.productoService = new ProductoService();
        this.productoValidator = ProductoValidator;
    }

    getProducto = (req, res) => {
        const productoId = req.params.productoId;
        this.productoValidator.validarProductoId(productoId);
        this.productoService.getProducto(productoId)
            .then(({ data, status }) => res.status(status).json(data))
    };

    postProducto = (req, res) => {
        const productoData = req.body;
        const resultBody = this.productoValidator.validarProducto(productoData);
        this.productoService.postProducto(resultBody)
            .then(({ data, status }) => res.status(status).json(data))
    }

    getProductosVendedor = (req, res) => {
        const vendedorId = req.params.vendedorId;
        UsuarioValidator.validarUsuarioId(vendedorId);

        const { page = 1, limit = 10 } = req.query;
        const { titulo, categoria, descripcion, precioMin, precioMax, orden } = req.query;

        // Obtener productos del vendedor y aplicar filtros
        this.productoService.getProductosPorVendedor(vendedorId, { page, limit }, { titulo, categoria, descripcion, precioMin, precioMax, orden })
            .then(({ data, status }) => res.status(status).json(data))
    }
}

export default new ProductoController();