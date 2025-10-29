import { EstadoPedido } from "../estadoPedido.js";
import { EstadoPedidoEnum } from "../estadoPedidoEnum.js";
import { StateError } from "../../../errors/errors.js";

export class EnviadoEstado extends EstadoPedido {
  constructor() {
    super(EstadoPedidoEnum.Enviado);
  }

  validarTransicion(pedido, usuario) {
    if (pedido.estado !== EstadoPedidoEnum.EnPreparacion) {
      return Promise.reject(new StateError("El pedido no puede ser enviado"));
    }
    return Promise.resolve();
  }

  generarNotificacion(pedido) {
    return `Su pedido ha sido enviado. ID de pedido: ${pedido._id}`;
  }

  obtenerDestinatarioNotificacion(pedido) {
    return pedido.comprador;
  }
}