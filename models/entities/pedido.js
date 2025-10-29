import {CambioEstadoPedido} from "../entities/cambioEstadoPedido.js"
import {EstadoPedidoEnum} from "../entities/estadoPedidoEnum.js"

export class Pedido {
    constructor(comprador, items, moneda, direccionEntrega) {
        this.comprador = comprador
        this.items = items
        this.moneda = moneda
        this.direccionEntrega = direccionEntrega
        this.estado = EstadoPedidoEnum.Pendiente
        this.fechaCreacion = new Date()
        this.historialEstados = []
    }

    calcularTotal() {
        return this.items.reduce((total, item) => {
            const subtotal = item.precioUnitario * item.cantidad;
            return total + subtotal;
        }, 0);
    }

    actualizarEstado(nuevoEstado, quien, motivo) {
        this.estado = nuevoEstado
        const fecha = new Date();
        const cambioEstadoPedido = new CambioEstadoPedido(fecha, nuevoEstado, quien, motivo)
        this.historialEstados.push(cambioEstadoPedido)
    }

    tieneItemsDe(usuario) {
        return this.items.every((item) => {
            return item.productoEmbebido.vendedor.toString() === usuario.toString();
        });
    }
}