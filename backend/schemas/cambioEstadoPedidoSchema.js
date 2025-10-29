import mongoose from 'mongoose';
import { EstadoPedidoEnum } from '../models/entities/estadoPedidoEnum.js';

export const cambioEstadoPedidoSchema = new mongoose.Schema({
    fecha: {
        type: Date,
        required: true,
        default: Date.now
    },
    estado: {
        type: String,
        required: true,
        enum: Object.values(EstadoPedidoEnum)
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    motivo: {
        type: String,
        trim: true
    }
}, { _id: false });