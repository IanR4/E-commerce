import { EstadoPedido } from "../estadoPedido.js";
import { EstadoPedidoEnum } from "../estadoPedidoEnum.js";

export class EntregadoEstado extends EstadoPedido {
  constructor() {
    super(EstadoPedidoEnum.Entregado);
  }

  validarTransicion(pedido, usuario) {
    if (pedido.estado !== EstadoPedidoEnum.Enviado) {
      return Promise.reject({
        name: "StateError", 
        message: "El pedido no puede ser entregado"
      });
    }
    return Promise.resolve();
  }
}