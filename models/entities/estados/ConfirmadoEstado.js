import { EstadoPedido } from "../estadoPedido.js";
import { EstadoPedidoEnum } from "../estadoPedidoEnum.js";

export class ConfirmadoEstado extends EstadoPedido {
  constructor() {
    super(EstadoPedidoEnum.Confirmado);
  }

  validarTransicion(pedido, usuario, factoryNotificacion) {
    if (pedido.estado !== EstadoPedidoEnum.Pendiente) {
      return Promise.reject({
        name: "StateError", 
        message: "El pedido no puede ser confirmado"
      });
    }
    return Promise.resolve();
  }
}