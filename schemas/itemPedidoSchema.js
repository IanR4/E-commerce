import mongoose from 'mongoose';

export const itemPedidoSchema = new mongoose.Schema({
    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
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