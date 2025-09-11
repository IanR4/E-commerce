import {CambioEstadoPedido} from "../models/entities/cambioEstadoPedido.js"

export class Pedido {
    constructor(comprador, items, moneda, direccionEntrega) {
        this.comprador = comprador
        this.items = items
        this.moneda = moneda
        this.direccionEntrega = direccionEntrega
        this.estado = EstadoPedido.Pendiente
        this.fechaCreacion = new Date()
        this.historialEstados = []
    }

    calcularTotal() {
        return this.items.sum((item) => item.subTotal);
    }

    actualizarEstado(nuevoEstado, quien, motivo) {
        this.estado = nuevoEstado
        const fecha = new Date();
        const cambioEstadoPedido = new CambioEstadoPedido(fecha, nuevoEstado, this, quien, motivo)
        this.historialEstados.push(cambioEstadoPedido)
    }

    validarStock() {
        return this.items.every((itemPedido) => itemPedido.producto.estaDisponible(itemPedido.cantidad))
    }

    notificarCreacion() {

    }
}  