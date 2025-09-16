import { Notificacion } from "../entities/notificacion.js";

export class FactoryNotificacion {
    constructor() {
        this.notificaciones = []
        this.nextId = 1
    }

    crearNotificacionDeEnviado(pedido){
        const nuevaNotificacion = new Notificacion(
            this.nextId,
            pedido.comprador,
            `Su pedido con ID ${pedido.id} ha sido enviado exitosamente.`,
        )
        this.nextId++
        this.notificaciones.push(nuevaNotificacion)
        //return nuevaNotificacion
    }
    crearNotificacionDeCancelacion(pedido){
        const nuevaNotificacion = new Notificacion(
            this.nextId,
            pedido.items[0].producto.vendedor,
            `Su pedido con ID ${pedido.id} ha sido cancelado.`
        )
        this.nextId++
        this.notificaciones.push(nuevaNotificacion)
        //return nuevaNotificacion
    }
    crearNotificacionDeCreacion(pedido){
        const productos = pedido.items.map(item => item.producto.titulo).join(", ")

        const nuevaNotificacion = new Notificacion(
            this.nextId,
            pedido.items[0].producto.vendedor,
            `El pedido con ID ${pedido.id} ha sido creado por el comprador con ID ${pedido.comprador.id} con dirección 
            ${pedido.direccionEntrega.calle} ${pedido.direccionEntrega.altura}, con precio total ${pedido.total} e 
            incluye el/los producto/s: ${productos}.`
        )
        this.nextId++
        this.notificaciones.push(nuevaNotificacion)
        //return nuevaNotificacion
    }

    findById(notificacionId) {
        return this.notificaciones.filter(notificacion => notificacion.id === notificacionId)[0]
    }
}