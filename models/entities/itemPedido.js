export class ItemPedido {
    constructor(producto, cantidad) {
        this.producto = producto
        this.cantidad = cantidad
        this.precioUnitario = producto.precio
    }

    subtotal() {
        return this.precioUnitario * this.cantidad
    }
}