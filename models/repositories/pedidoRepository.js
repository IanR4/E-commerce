
export class PedidoRepository {
    constructor() {
        this.pedidos = []
        this.nextId = 1
    }

    crearPedido(pedido){
        pedido.id = this.nextId
        this.nextId++
        this.pedidos.push(pedido)
        return pedido
    }

    findById(pedidoId) {
        return this.pedidos.filter(pedido => pedido.id === pedidoId)[0]
    }
}