import { Notificacion } from "../entities/notificacion.js"
import { EstadoPedido } from "./estadoPedido.js"

export class FactoryNotificacion {
    crearSegunEstadoPedido(estado) {
        switch(estado) {
            case EstadoPedido.Cancelado:
                return "Su pedido ha sido cancelado."
                break
            case EstadoPedido.Confirmado:
                return "Su pedido ha sido confirmado."
                break
            case EstadoPedido.Enviado:
                return "Su pedido ha sido enviado."
                break
            default:
                return Promise.reject({name: "StateError", message: "Estado no válido"});
        }
    }

    crearSegunPedido(pedido) {
        const mensaje = this.crearSegunEstadoPedido(pedido.estado)
        const destinatario = this.obtenerDestinatarioSegunEstadoPedido(pedido)
        if(pedido.estado === EstadoPedido.Confirmado) {
            return new Notificacion(destinatario, `${mensaje} El pedido con ID ${pedido.id} ha sido creado por el comprador con ID ${pedido.comprador.id}. La dirección de entrega es 
            ${pedido.direccionEntrega.calle} ${pedido.direccionEntrega.altura}. El pedido incluye el/los producto/s: ${pedido.items}. Y su precio total es ${pedido.calcularTotal()}.`)
        } else {
            return new Notificacion(destinatario, `${mensaje} ID de pedido: ${pedido.id}`)
        }
    }

    obtenerDestinatarioSegunEstadoPedido(pedido) {
        switch(pedido.estado) {
            case EstadoPedido.Cancelado:
            case EstadoPedido.Confirmado:
                return pedido.items[0].producto.vendedor
                break
            case EstadoPedido.Enviado:
                return pedido.comprador
                break
            default:
                return Promise.reject({name: "StateError", message: "Estado no válido"});
        }
    }
}