import { EstadoPedido } from "../estadoPedido.js";
import { EstadoPedidoEnum } from "../estadoPedidoEnum.js";
import { StateError } from "../../../errors/errors.js";

export class ConfirmadoEstado extends EstadoPedido {
  constructor() {
    super(EstadoPedidoEnum.Confirmado);
  }

  validarTransicion(pedido, usuario) {
    if (pedido.estado !== EstadoPedidoEnum.Pendiente) {
      return Promise.reject(new StateError("El pedido no puede ser confirmado"));
    }
    return Promise.resolve();
  }

  generarNotificacion(pedido) {
    const productosDescripcion = pedido.items
      .map(item => `${item.productoEmbebido.titulo} (x${item.cantidad})`)
      .join(', ');
    
    return `Su pedido ha sido confirmado. El pedido con ID ${pedido._id} ha sido creado por el comprador con ID ${pedido.comprador}. ` +
          `La dirección de entrega es ${pedido.direccionEntrega}. ` +
          `El pedido incluye: ${productosDescripcion}.`;
  }

  obtenerDestinatarioNotificacion(pedido) {
    return pedido.items[0].productoEmbebido.vendedor;
  }
}