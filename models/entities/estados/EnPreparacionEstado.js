import { EstadoPedido } from "../estadoPedido.js";
import { EstadoPedidoEnum } from "../estadoPedidoEnum.js";

export class EnPreparacionEstado extends EstadoPedido {
  constructor() {
    super(EstadoPedidoEnum.EnPreparacion);
  }

  validarTransicion(pedido, usuario, factoryNotificacion) {
    if (pedido.estado !== EstadoPedidoEnum.Confirmado) {
      return Promise.reject({
        name: "StateError", 
        message: "El pedido no puede ser preparado"
      });
    }
    return Promise.resolve();
  }
}