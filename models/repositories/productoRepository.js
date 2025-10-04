class ProductoRepository {
    constructor() {
        this.productos = []
        this.nextId = 1
    }

    crearProducto(producto){
        producto.id = this.nextId
        this.nextId++
        this.productos.push(producto)
        return producto
    }

    findById(productoId) {
        return this.productos.filter(producto => producto.id === productoId)[0]
    }
}

export default new ProductoRepository();