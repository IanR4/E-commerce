export class FactoryNotificacion {
    constructor() {
        this.notificaciones = []
        this.nextId = 1
    }

    crearNotificacionParaComprador(pedido){
        pedido.id = this.nextId
        this.nextId++
        this.pedidos.push(pedido)
        return pedido
    }

    findById(pedidoId) {
        return this.pedidos.filter(pedido => pedido.id === pedidoId)[0]
    }
}