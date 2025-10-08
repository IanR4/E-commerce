import {ItemPedido} from "../models/entities/itemPedido.js"
import ProductoRepository from "../models/repositories/productoRepository.js";
import productoValidator from "../validators/productoValidator.js";

class itemPedidoCreator {

    crearItems(nuevosItems) {
        // Array de promesas para cada producto
        const promesas = nuevosItems.map(item => {
            const productoId = item.producto; 
            return ProductoRepository.findById(productoId)
                .then(producto => {
                    if (!producto) {
                        throw { name: "NotFoundError", message: "Producto no encontrado" };
                    }
                    return new ItemPedido(
                        producto,
                        item.cantidad,
                        producto.precio
                    );
                });
        });
        // Esperar todas las promesas y devolver el array de items
        return Promise.all(promesas);
    }
}

export default new itemPedidoCreator();
