import {Pedido} from "../models/entities/pedido.js"

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