import { ProductoModel } from '../../schemas/productoSchema.js';

class ProductoRepository {
    constructor() {
        this.model = ProductoModel;
    }

    crearProducto(producto){
        const nuevoProducto = new this.model(producto);
        return nuevoProducto.save();
    }

    findAll() {
        return this.model.find().exec();
    }

    findById(productoId) {
        return this.model.findOne({ _id: productoId }).exec();
    }

    ordenarProductos(query, orden) {
        if (orden == "precioAsc") {
            return this.model.find(query).sort({ precio: 1 }).exec();
        } else if (orden == "precioDesc") {
            return this.model.find(query).sort({ precio: -1 }).exec();
        } else if (orden == "masVendidos") {
            return this.model.aggregate([
                { $match: query },
                {
                    $lookup: {
                        from: 'pedidos',
                        let: { productoId: '$_id' },
                        pipeline: [
                            { $unwind: '$items' },
                            { $match: { $expr: { $eq: ['$items.producto', '$$productoId'] } } },
                            {
                                $group: {
                                    _id: '$items.producto',
                                    totalVentas: { $sum: { $multiply: ['$items.cantidad', '$items.precioUnitario'] } }
                                }
                            }
                        ],
                        as: 'ventas'
                    }
                },
                {
                    $addFields: {
                        ventasTotal: { $ifNull: [{ $arrayElemAt: ['$ventas.totalVentas', 0] }, 0] }
                    }
                },
                { $sort: { ventasTotal: -1 } }
            ]).exec();
        }
        return this.model.find(query).exec();
    }

    findByVendedor(vendedorId, filtros) {
        const { titulo, categoria, descripcion, precioMin, precioMax, orden } = filtros || {}
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
        return this.ordenarProductos(query, orden);
    }
}

export default new ProductoRepository();