import {Pedido} from "../models/entities/pedido.js"
import { PedidoRepository } from "../models/repositories/pedidoRepository.js";
import { CambioEstadoPedido } from "../models/entities/cambioEstadoPedido.js";

export default class PedidoService {
    constructor() {
        this.pedidoRepository = new PedidoRepository();
    }

    getPedido(pedidoId) {
        return Promise.all([this.pedidoRepository.findById(pedidoId)])
        .then((pedidoRes) => {
            return {
                data: {
                    pedido: pedidoRes
                },
                status: 200
            };
        });
    }
    postPedido(pedidoData) {
        const nuevoPedido = new Pedido(
            pedidoData.comprador,
            pedidoData.items,
            pedidoData.moneda,
            pedidoData.direccionEntrega,
            pedidoData.fechaCreacion
        )
        if(!nuevoPedido.validarStock()){
            nuevoPedido = null
            return Promise.reject({name: "StockError", message: "No hay stock suficiente para completar el pedido"});
        }
        const pedidoGuardado = this.pedidoRepository.crearPedido(nuevoPedido);
        return Promise.resolve({
            data: pedidoGuardado,
            status: 201
        });
    }

    patchPedido(pedidoId, pedidoData) {
        const pedido = this.pedidoRepository.findById(pedidoId);
            if(!pedido) {
                return Promise.reject({name: "NotFoundError", message: "Pedido no encontrado"});
            }
        
        if(pedidoData.estado) {
            const cambioEstado = new CambioEstadoPedido(
                new Date(),
                pedidoData.estado,
                pedido,
                pedidoData.motivo
            );
        }

        return Promise.all([this.pedidoRepository.actualizarPedido(pedidoId, pedidoData)])
         .then((pedidoRes) => {
             return {
                 data: pedidoRes,
                 status: 200
             };
         });
    }
}
