import {ItemPedido} from "../models/entities/itemPedido.js"
import ProductoRepository from "../models/repositories/productoRepository.js";
import { StockError } from "../errors/errors.js";

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
                    // Validar stock disponible
                    if (!producto.estaDisponible(item.cantidad)) {
                        throw new StockError(`Stock insuficiente para el producto: ${producto.titulo}`);
                    }
                    
                    // Reducir stock del producto
                    producto.reducirStock(item.cantidad);
                    
                    // Guardar el producto actualizado (con el nuevo stock)
                    return ProductoRepository.actualizar(producto._id, producto)
                        .then(() => {
                            // Crear ItemPedido con el snapshot embebido
                            return new ItemPedido(producto, item.cantidad);
                        });
                });                
        });
        // Esperar todas las promesas y devolver el array de items
        return Promise.all(promesas);
    }
}

export default new itemPedidoCreator();
