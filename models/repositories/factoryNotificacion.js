import { Notificacion } from "../entities/notificacion.js";

export class FactoryNotificacion {
    constructor() {
        this.notificaciones = []
        this.nextId = 1
    }

    crearNotificacionParaComprador(pedido){
        const nuevaNotificacion = new Notificacion(
            this.nextId,
            pedido.comprador,
            `Su pedido con ID ${pedido.id} ha sido enviado exitosamente.`,
        )
        this.nextId++
        this.notificaciones.push(nuevaNotificacion)
        return nuevaNotificacion
    }
    crearNotificacionDeCancelacion(pedido, vendedor){
        const nuevaNotificacion = new Notificacion(
            this.nextId,
            vendedor,
            `Su pedido con ID ${pedido.id} ha sido cancelado.`
        )
        this.nextId++
        this.notificaciones.push(nuevaNotificacion)
        return nuevaNotificacion
    }
    crearNotificacionDeCreacion(pedido, vendedor){
        const productos = pedido.items.map(item => item.producto.titulo).join(", ")

        const nuevaNotificacion = new Notificacion(
            this.nextId,
            vendedor,
            `El pedido con ID ${pedido.id} ha sido creado por el comprador con ID ${pedido.comprador} con dirección 
            ${pedido.direccionEntrega.calle} ${pedido.direccionEntrega.altura}, con precio total ${pedido.total} e 
            incluye el/los producto/s: ${productos}.`
        )
        this.nextId++
        this.notificaciones.push(nuevaNotificacion)
        return nuevaNotificacion
    }

    findById(notificacionId) {
        return this.pedidos.filter(notificacion => notificacion.id === notificacionId)[0]
    }
}