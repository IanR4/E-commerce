import { Notificacion } from "../entities/notificacion.js"
import { EstadoPedidoEnum } from "./estadoPedidoEnum.js"
import UsuarioRepository from "../repositories/usuarioRepository.js"
import ProductoRepository from "../repositories/productoRepository.js"

export class FactoryNotificacion {
    crearSegunEstadoPedido(estado) {
        switch(estado) {
            case EstadoPedidoEnum.Cancelado:
                return "Su pedido ha sido cancelado."
                break
            case EstadoPedidoEnum.Confirmado:
                return "Su pedido ha sido confirmado."
                break
            case EstadoPedidoEnum.Enviado:
                return "Su pedido ha sido enviado."
                break
            default:
                
        }
    }

    crearSegunPedido(pedido) {
        return this.obtenerDestinatarioSegunEstadoPedido(pedido)
            .then(destinatario => {
                const mensaje = this.crearSegunEstadoPedido(pedido.estado);
                if(pedido.estado === EstadoPedidoEnum.Confirmado) {
                    return new Notificacion(destinatario, `${mensaje} El pedido con ID ${pedido._id} ha sido creado por el comprador con ID ${pedido.comprador}. La dirección de entrega es 
                    ${pedido.direccionEntrega}. El pedido incluye el/los producto/s: ${pedido.items}.`);
                } else {
                    return new Notificacion(destinatario, `${mensaje} ID de pedido: ${pedido.id}`);
                }
            });
    }

    obtenerDestinatarioSegunEstadoPedido(pedido) {
        switch(pedido.estado) {
            case EstadoPedidoEnum.Cancelado:
            case EstadoPedidoEnum.Confirmado: {
                const productoId = pedido.items[0].producto;
                return ProductoRepository.findById(productoId)
                    .then(producto => {
                        const vendedorId = producto.vendedor;
                        return UsuarioRepository.findById(vendedorId);
                    });
            }
            case EstadoPedidoEnum.Enviado:
                return Promise.resolve(pedido.comprador);
            default:
                
        }
    }
}