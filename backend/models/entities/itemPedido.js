export class ItemPedido {
    constructor(producto, cantidad) {
        this.productoId = producto._id || producto.id;
        
        this.productoEmbebido = {
            titulo: producto.titulo,
            descripcion: producto.descripcion,
            categorias: producto.categorias || [],
            fotos: producto.fotos || [],
            vendedor: producto.vendedor
        };
        
        this.cantidad = cantidad;
        this.precioUnitario = producto.precio;
    }

    subtotal() {
        return this.precioUnitario * this.cantidad;
    }
}