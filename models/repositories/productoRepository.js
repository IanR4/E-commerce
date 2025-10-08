import { ProductoModel } from '../../schemas/productoSchema.js';

class ProductoRepository {
    constructor() {
        this.model = ProductoModel;
    }

    crearProducto(producto){
        const nuevoProducto = new this.model(producto);
        return nuevoProducto.save();
    }

    findById(productoId) {
        return this.model.findOne({ _id: productoId }).exec();
    }

    ordenarProductos(productos, orden) {
        if (orden == "precioAsc") {
            console.log(productos);
            return productos.sort((a, b) => Number(a.precio) - Number(b.precio));
        } else if (orden == "precioDesc") {
            return productos.sort((a, b) => Number(b.precio) - Number(a.precio));
        } else if (orden == "masVendidos") {
            return Promise.all(productos.map(async p => ({
                producto: p,
                ventas: await p.ventas()
            }))).then(arr => {
                // Ordenar por ventas descendente
                arr.sort((a, b) => Number(b.ventas) - Number(a.ventas));
                // Devolver solo los productos ordenados
                return arr.map(obj => obj.producto);
            });
        }
        return productos; // Sin orden específico
    }

    findByVendedor(vendedorId, filtros) {
        const { titulo, categoria, descripcion, precioMin, precioMax, orden } = filtros
        const query = {
            vendedor: vendedorId,
            ...(titulo && { titulo: { $regex: titulo, $options: "i" } }),
            ...(categoria && { categorias: categoria }),
            ...(descripcion && { descripcion: { $regex: descripcion, $options: "i" } }),
            ...(precioMin !== undefined || precioMax !== undefined
            ? {
                precio: {
                    ...(precioMin !== undefined ? { $gte: parseFloat(precioMin) } : {}),
                    ...(precioMax !== undefined ? { $lte: parseFloat(precioMax) } : {})
                }
            }
        : {})
        };
        //const productos = this.model.find(query).exec();
        //return this.ordenarProductos(productos, filtros.orden);
        return this.model.find(query).exec().then(productos => {
            return this.ordenarProductos(productos, orden);
        });
    }
}

export default new ProductoRepository();