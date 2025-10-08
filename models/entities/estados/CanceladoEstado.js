import { EstadoPedido } from "../estadoPedido.js";
import { EstadoPedidoEnum } from "../estadoPedidoEnum.js";

export class CanceladoEstado extends EstadoPedido {
  constructor() {
    super(EstadoPedidoEnum.Cancelado);
  }

  validarTransicion(pedido, usuario) {
    if (pedido.estado === EstadoPedidoEnum.Enviado || pedido.estado === EstadoPedidoEnum.Entregado) {
      return Promise.reject({
        name: "StateError", 
        message: "El pedido no puede ser cancelado"
      });
    }
    return Promise.resolve();
  }
}