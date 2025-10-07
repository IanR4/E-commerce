import mongoose from 'mongoose';
import { Pedido } from '../models/entities/pedido.js';
import { EstadoPedidoEnum } from '../models/entities/estadoPedidoEnum.js';
import { Moneda } from '../models/entities/moneda.js';
import { cambioEstadoPedidoSchema } from './cambioEstadoPedidoSchema.js';
import { itemPedidoSchema } from './itemPedidoSchema.js';
import { direccionEntregaSchema } from './direccionEntregaSchema.js';

const pedidoSchema = new mongoose.Schema({
    comprador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    items: {
        type: [itemPedidoSchema],
        required: true
    },
    moneda: {
        type: String,
        required: true,
        enum: Object.values(Moneda)
    },
    direccionEntrega: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        required: true,
        enum: Object.values(EstadoPedidoEnum)
    },
    fechaCreacion: {
        type: Date,
        required: true,
        default: Date.now
    },
    historialEstados: {
        type: [cambioEstadoPedidoSchema],
        default: []
    }
}, {
    collection: 'pedidos'
});

pedidoSchema.loadClass(Pedido);

export const PedidoModel = mongoose.model('Pedido', pedidoSchema);