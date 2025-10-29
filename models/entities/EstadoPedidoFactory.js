import { EstadoPedidoEnum } from "./estadoPedidoEnum.js";
import { PendienteEstado } from "./estados/PendienteEstado.js";
import { ConfirmadoEstado } from "./estados/ConfirmadoEstado.js";
import { EnPreparacionEstado } from "./estados/EnPreparacionEstado.js";
import { EnviadoEstado } from "./estados/EnviadoEstado.js";
import { EntregadoEstado } from "./estados/EntregadoEstado.js";
import { CanceladoEstado } from "./estados/CanceladoEstado.js";

export class EstadoPedidoFactory {
  static estadosRegistry = {
    [EstadoPedidoEnum.Pendiente]: PendienteEstado,
    [EstadoPedidoEnum.Confirmado]: ConfirmadoEstado,
    [EstadoPedidoEnum.EnPreparacion]: EnPreparacionEstado,
    [EstadoPedidoEnum.Enviado]: EnviadoEstado,
    [EstadoPedidoEnum.Entregado]: EntregadoEstado,
    [EstadoPedidoEnum.Cancelado]: CanceladoEstado
  };

  static crearEstado(tipoEstado) {
    const EstadoClase = this.estadosRegistry[tipoEstado];
    
    if (!EstadoClase) {
      throw new Error(`Estado no válido: ${tipoEstado}`);
    }
    
    return new EstadoClase();
  }
}