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
}