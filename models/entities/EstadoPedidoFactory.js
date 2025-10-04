import { EstadoPedidoEnum } from "./estadoPedidoEnum.js";
import { PendienteEstado } from "./estados/PendienteEstado.js";
import { ConfirmadoEstado } from "./estados/ConfirmadoEstado.js";
import { EnPreparacionEstado } from "./estados/EnPreparacionEstado.js";
import { EnviadoEstado } from "./estados/EnviadoEstado.js";
import { EntregadoEstado } from "./estados/EntregadoEstado.js";
import { CanceladoEstado } from "./estados/CanceladoEstado.js";

export class EstadoPedidoFactory {
  static crearEstado(tipoEstado) {
    switch (tipoEstado) {
      case EstadoPedidoEnum.Pendiente:
        return new PendienteEstado();
      case EstadoPedidoEnum.Confirmado:
        return new ConfirmadoEstado();
      case EstadoPedidoEnum.EnPreparacion:
        return new EnPreparacionEstado();
      case EstadoPedidoEnum.Enviado:
        return new EnviadoEstado();
      case EstadoPedidoEnum.Entregado:
        return new EntregadoEstado();
      case EstadoPedidoEnum.Cancelado:
        return new CanceladoEstado();
      default:
        throw new Error(`Estado no válido: ${tipoEstado}`);
    }
  }
}