import { z } from "zod"
import ProductoService from "../services/productoService.js"
import ProductoValidator from "../validators/productoValidator.js"

class ProductoController {
    constructor() {
        this.productoService = new ProductoService();
        this.productoValidator = ProductoValidator;
    }

    getProducto = (req, res, next) => {
        productoId = this.productoValidator.validarProductoId(parseInt(req.params.productoId, 10));
        this.productoService.getProducto(productoId)
            .then(({ data, status }) => res.status(status).json(data))
            .catch(next);
    };


    postProducto = (req, res, next) => {
        const productoData = req.body;
        const resultBody = this.productoValidator.validarProducto(productoData);
        this.productoService.postProducto(resultBody.data)
            .then(({ data, status }) => res.status(status).json(data))
            .catch(next);
    }
}

export default new ProductoController();
