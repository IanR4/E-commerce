import { EstadoPedido } from "../estadoPedido.js";
import { EstadoPedidoEnum } from "../estadoPedidoEnum.js";
import { StateError } from "../../../errors/errors.js";

export class EnPreparacionEstado extends EstadoPedido {
  constructor() {
    super(EstadoPedidoEnum.EnPreparacion);
  }

  validarTransicion(pedido, usuario) {
    if (pedido.estado !== EstadoPedidoEnum.Confirmado) {
      return Promise.reject(new StateError("El pedido no puede ser preparado"));
    }
    return Promise.resolve();
  }

  generarNotificacion(pedido) {
    return null;
  }
}