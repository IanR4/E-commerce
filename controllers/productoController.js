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
}

export default new ProductoController();
