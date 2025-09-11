import { z } from "zod"

export class PedidoController {
    constructor(pedidoService) {
        this.pedidoService = pedidoService
    }

    

    crear(req, res, next) {
        const body = req.body
        const resultBody = pedidoSchema.safeParse(body)

        if(resultBody.error) {
            res.status(400).json(resultBody.error.issues)
            return
        }

        const nuevoPedido = this.pedidoService.crear(resultBody.data);
        res.status(201).json(nuevoPedido);
    }
}

// Ver despues
const pedidoSchema = z.object({
    nombre: z.string().min(3).max(20),
    categoria: z.string(),
    precioPorNoche: z.number().nonnegative()
})