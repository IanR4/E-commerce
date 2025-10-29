export class EstadoPedido {
  constructor(estado) {
    this.estado = estado;
  }

  validarTransicion(pedido, usuario) {
    // Método abstracto - cada estado lo implementa
  }

  generarNotificacion(pedido) {
    return null;
  }

  obtenerDestinatarioNotificacion(pedido) {
    return null;
  }
}