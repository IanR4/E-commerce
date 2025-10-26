import {CambioEstadoPedido} from "../entities/cambioEstadoPedido.js"
import {EstadoPedido} from "../entities/estadoPedido.js"

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
        return this.items.reduce((total, item) => total + item.subtotal(), 0)
    }

    actualizarEstado(nuevoEstado, quien, motivo) {
        this.estado = nuevoEstado
        const fecha = new Date();
        const cambioEstadoPedido = new CambioEstadoPedido(fecha, nuevoEstado, quien, motivo)
        this.historialEstados.push(cambioEstadoPedido)
    }

    validarStock() {
        return this.items.every((itemPedido) => itemPedido.producto.estaDisponible(itemPedido.cantidad))
    }

    tieneItemsDe(usuario) {
        return this.items.every((item) => item.producto.vendedor === usuario)
    }

    reducirStockItems() {
        this.items.forEach((item) => item.producto.reducirStock(item.cantidad));
    }

}  