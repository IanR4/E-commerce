import { z } from "zod";
import { Moneda } from "../models/entities/moneda.js";
import { BadRequestError, NotFoundError, ValidationError, StockError } from "../errors/errors.js";
import UsuarioRepository from "../models/repositories/usuarioRepository.js";
import PedidoRepository from "../models/repositories/pedidoRepository.js";

class PedidoValidator {
    constructor() {
        this.pedidoRepository = PedidoRepository;
        this.usuarioRepository = UsuarioRepository;
    }

    validarPedidoId(pedidoId) {
        if (!pedidoId) {
            throw new BadRequestError("Invalid pedidoId parameter");
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

    buscarPedido(pedidoId) {
        const pedido = this.pedidoRepository.findById(pedidoId);
        if(!pedido) {
            return Promise.reject(new NotFoundError("Pedido no encontrado"));
        }
        return pedido;
    }

    buscarPedidoUsuario(usuarioId) {
        const listaPedido = this.pedidoRepository.findByUser(usuarioId);
        if(!listaPedido) {
            return Promise.reject(new NotFoundError("Lista de pedidos no encontrada"));
        }
        return listaPedido;
    }

    validarStockPedido(pedido) {
        if(!pedido.validarStock()){
            return Promise.reject(new StockError("No hay stock suficiente para completar el pedido"));
        }
    }
}

const itemPedidoSchema = z.object({
    producto: z.string().min(1),
    cantidad: z.number().positive(),
    precioUnitario: z.number().nonnegative()
})

const pedidoSchema = z.object({
    comprador: z.string().min(1),
    moneda: z.nativeEnum(Moneda),
    direccionEntrega: z.string(),
    items: z.array(itemPedidoSchema).min(1),
})

export default new PedidoValidator();