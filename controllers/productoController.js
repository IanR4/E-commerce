import { z } from "zod"
import ProductoService from "../services/productoService.js"
import { Moneda } from "../models/entities/moneda.js"

class ProductoController {
    constructor() {
        this.productoService = new ProductoService();
    }

    getProducto = (req, res, next) => {
        const productoId = parseInt(req.params.productoId, 10);
        if (isNaN(productoId)) {
            return res.status(400).json({ error: "Invalid productoId parameter" });
        }
        this.productoService.getProducto(productoId)
            .then(({ data, status }) => res.status(status).json(data))
            .catch(next);
    };


    postProducto = (req, res, next) => {
        const productoData = req.body;
        const resultBody = productoSchema.safeParse(productoData)
        if (!resultBody.success) {
            return res.status(400).json({ error: "Invalid request body", details: resultBody.error.errors });
        }
        this.productoService.postProducto(resultBody.data)
            .then(({ data, status }) => res.status(status).json(data))
            .catch(next);
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

export default new ProductoController();
