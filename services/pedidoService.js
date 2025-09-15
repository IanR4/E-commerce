import {Pedido} from "../models/entities/pedido.js"
import { PedidoRepository } from "../models/repositories/pedidoRepository.js";
/*
export class PedidoService {
    constructor(pedidoRepository) {
        this.pedidoRepository = pedidoRepository
    }

    crear(nuevoPedidoJSON) {

        const nuevoPedido = new Pedido(
            nuevoPedidoJSON.comprador,
            nuevoPedidoJSON.items,
            nuevoPedidoJSON.moneda,
            nuevoPedidoJSON.direccionEntrega,
            nuevoPedidoJSON.fechaCreacion
        )

        // Ver despues
        if(!nuevoPedido.validarStock()) {
            return
        }
        
        nuevoPedido.notificarCreacion()

        const pedidoGuardado = this.pedidoRepository.crear(nuevoPedido)
        
        return pedidoGuardado
    }
} 
*/
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

    getPedidosUsuario(usuarioId) {
        return Promise.all([this.pedidoRepository.findByUser(usuarioId)])
        .then((listaPedidos) => {
            return {
                data: {
                    pedidos: listaPedidos
                },
                status: 200
            };
        });
    }
}
