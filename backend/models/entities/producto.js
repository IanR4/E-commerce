export class Producto {
    constructor(vendedor, titulo, descripcion, categorias, precio, moneda, stock, fotos) {
        this.vendedor = vendedor
        this.titulo = titulo
        this.descripcion = descripcion
        this.categorias = categorias
        this.precio = precio
        this.moneda = moneda
        this.stock = stock
        this.fotos = fotos
        this.activo = true
    }

    estaDisponible(cantidad) {
        return this.stock >= cantidad
    }

    reducirStock(cantidad) {
        this.stock -= cantidad
    }

    aumentarStock(cantidad) {
        this.stock += cantidad
    }

    ventas() {
        return Promise.resolve( PedidoModel.aggregate([
            { $unwind: "$items" },
            { $match: { "items.producto": this._id } },
            {
                $group: {
                _id: null,
                totalVentas: {
                    $sum: { $multiply: ["$items.cantidad", "$items.precioUnitario"] }
                    }
                }
            }
        ]).exec()). then((resultado) => {
        return resultado[0]?.totalVentas || 0;
        })
    }
}