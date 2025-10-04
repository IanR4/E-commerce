import { EstadoPedido } from "../estadoPedido.js";
import { EstadoPedidoEnum } from "../estadoPedidoEnum.js";

export class PendienteEstado extends EstadoPedido {
  constructor() {
    super(EstadoPedidoEnum.Pendiente);
  }

  validarTransicion(pedido, usuario, factoryNotificacion) {
    return Promise.resolve();
  }
}