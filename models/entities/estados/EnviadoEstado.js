import { EstadoPedido } from "../estadoPedido.js";
import { EstadoPedidoEnum } from "../estadoPedidoEnum.js";

export class EnviadoEstado extends EstadoPedido {
  constructor() {
    super(EstadoPedidoEnum.Enviado);
  }

  validarTransicion(pedido, usuario) {
    if (pedido.estado !== EstadoPedidoEnum.EnPreparacion) {
      return Promise.reject({
        name: "StateError", 
        message: "El pedido no puede ser enviado"
      });
    }

    if (!pedido.tieneItemsDe(usuario)) {
      return Promise.reject({
        name: "SellerError", 
        message: "El usuario no vende los productos de este pedido"
      });
    }
    return Promise.resolve();
  }
}