import { EstadoPedido } from "../estadoPedido.js";
import { EstadoPedidoEnum } from "../estadoPedidoEnum.js";
import { StateError } from "../../../errors/errors.js";

export class EntregadoEstado extends EstadoPedido {
  constructor() {
    super(EstadoPedidoEnum.Entregado);
  }

  validarTransicion(pedido, usuario) {
    if (pedido.estado !== EstadoPedidoEnum.Enviado) {
      return Promise.reject(new StateError("El pedido no puede ser entregado"));
    }
    return Promise.resolve();
  }
  
  generarNotificacion(pedido) {
    return null;
  }
}