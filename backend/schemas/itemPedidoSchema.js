import mongoose from 'mongoose';

export const itemPedidoSchema = new mongoose.Schema({
    productoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    },

    productoEmbebido: {
        titulo: {
            type: String,
            required: true
        },
        descripcion: {
            type: String,
            required: true
        },
        categorias: {
            type: [String],
            default: []
        },
        foto: {
            type: String
        },
        vendedor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario',
            required: true
        }
    },
    cantidad: {
        type: Number,
        required: true,
        min: 1
    },
    precioUnitario: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false });