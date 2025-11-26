import { ProductoModel } from '../../schemas/productoSchema.js';
import mongoose from 'mongoose';

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

    actualizar(productoId, productoData) {
        return this.model.findByIdAndUpdate(productoId, productoData, { new: true }).exec();
    }

    eliminar(productoId) {
        return this.model.findByIdAndDelete(productoId).exec();
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
                        { 
                            $match: { 
                                $expr: { 
                                    $eq: ['$items.productoId', '$$productoId'] 
                                } 
                            } 
                        },

                        {
                            $group: {
                                _id: '$items.productoId',
                                totalVentas: { 
                                    $sum: { 
                                        $multiply: ['$items.cantidad', '$items.precioUnitario'] 
                                    } 
                                }
                            }
                        }
                    ],
                    as: 'ventas'
                }
            },

            {
                $addFields: {
                    ventasTotal: { 
                        $ifNull: [
                            { $arrayElemAt: ['$ventas.totalVentas', 0] },
                            0
                        ] 
                    }
                }
            },

            { $sort: { ventasTotal: -1 } }
        ])
        .exec()
        .then(results => {
            if (typeof this.model.hydrate === 'function') {
                return results.map(r => this.model.hydrate(r));
            }
            return results;
        });
    }

    return this.model.find(query).exec();
    }

    findByVendedor(vendedorId, filtros) {
        const { titulo, categoria, descripcion, precioMin, precioMax, orden } = filtros || {}
        // Convertir vendedorId a ObjectId para que $match en aggregation funcione correctamente, despues cuando hagamos el embebido puede ser que haya que cambiarlo
        let vendedorOid = vendedorId;
        try {
            vendedorOid = new mongoose.Types.ObjectId(vendedorId);
        } catch (e) {
            // si no es un ObjectId válido, dejar el valor original y permitir que la consulta falle o devuelva vacío
            vendedorOid = vendedorId;
        }
        const query = {
            vendedor: vendedorOid,
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

    findByFiltros(filtros) {
        const { titulo, categoria, descripcion, precioMin, precioMax, orden } = filtros || {}
        const query = {
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