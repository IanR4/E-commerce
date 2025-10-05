import {ItemPedido} from "../models/entities/itemPedido.js"
import ProductoRepository from "../models/repositories/productoRepository.js";
import productoValidator from "../validators/productoValidator.js";

class itemPedidoCreator {

    crearItems(nuevosItems){
        const itemsCreados = []
        for (let i = 0; i < nuevosItems.length; i++) {
            const productoId = parseInt(nuevosItems[i].producto, 10);
            const producto = ProductoRepository.findById(productoId);
            console.log(producto)
            if(!producto) {
                return Promise.reject({name: "NotFoundError", message: "Producto no encontrado"});
            }
            const nuevoItemPedido = new ItemPedido(
                producto,
                nuevosItems[i].cantidad,
                nuevosItems[i].precioUnitario
            )
            itemsCreados.push(nuevoItemPedido)
        }
        return itemsCreados;
    }
}

export default new itemPedidoCreator();
