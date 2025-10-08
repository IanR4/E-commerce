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

    // if (!pedido.tieneItemsDe(usuario)) {
    //   return Promise.reject(new StateError("El usuario no vende los productos de este pedido"));
    // }
    return Promise.resolve();
  }
}