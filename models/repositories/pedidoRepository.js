
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


    actualizarPedido(pedidoId, pedido) {
        const indice = this.pedidos.findIndex(pedido => pedido.id === pedidoId)
        if (indice === -1) return null
        // const pedidoActualizado = {...this.pedidos[indice], ...pedido}
        this.pedidos[indice] = pedido
        return pedido
    }

    findByUser(usuarioId) {
        return this.pedidos.filter(pedido => pedido.comprador === usuarioId)
    }
}