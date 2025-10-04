import { z } from "zod";
import { Moneda } from "../models/entities/moneda.js";
import {BadRequestError, NotFoundError, ValidationError } from "../errors/errors.js";

class PedidoValidator {
    validarPedidoId(pedidoId) {
        if (isNaN(pedidoId)) {
            throw new BadRequestError("Invalid pedidoId parameter");
        }
    }

    validarUsuarioId(usuarioId) {
        if (isNaN(usuarioId)) {
            throw new BadRequestError("Invalid usuarioId parameter");
        }
    }

    validarPedido(pedido) {
        try {
            return pedidoSchema.parse(pedido);
        }
        catch(error) {
            throw new ValidationError("Invalid request body", error.errors);
        }
    }
}

const pedidoSchema = z.object({
    comprador: z.string().min(1),
    moneda: z.nativeEnum(Moneda),
    direccionEntrega: z.object(),
    items: z.array().min(1),
})

export default new PedidoValidator();