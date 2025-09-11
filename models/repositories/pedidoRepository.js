
export class PedidoRepository {
    constructor() {
        this.pedidos = []
        this.nextId = 1
    }

    crear(pedido) {
        pedido.id = this.nextId
        this.nextId++
        this.pedidos.push(pedido)
        return pedido
    }
}