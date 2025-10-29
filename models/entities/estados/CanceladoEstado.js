import { EstadoPedido } from "../estadoPedido.js";
import { EstadoPedidoEnum } from "../estadoPedidoEnum.js";
import { StateError } from "../../../errors/errors.js";

export class CanceladoEstado extends EstadoPedido {
  constructor() {
    super(EstadoPedidoEnum.Cancelado);
  }

  validarTransicion(pedido, usuario) {
    if (pedido.estado === EstadoPedidoEnum.Enviado || pedido.estado === EstadoPedidoEnum.Entregado) {
      return Promise.reject(new StateError("El pedido no puede ser cancelado"));
    }
    return Promise.resolve();
  }

  generarNotificacion(pedido) {
    return `Su pedido ha sido cancelado. ID de pedido: ${pedido._id}`;
  }

  obtenerDestinatarioNotificacion(pedido) {
    return pedido.items[0].productoEmbebido.vendedor;
  }
}