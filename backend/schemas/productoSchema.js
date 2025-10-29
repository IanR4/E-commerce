import mongoose from 'mongoose';
import { Producto } from '../models/entities/producto.js';
import { Moneda } from '../models/entities/moneda.js';
import { categoriaSchema } from './categoriaSchema.js';

const productoSchema = new mongoose.Schema({
    vendedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    titulo: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    descripcion: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    categorias: {
        type: [String],
        required: false
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    moneda: {
        type: String,
        required: true,
        enum: Object.values(Moneda)
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    fotos: {
        type: [String],
        default: []
    },
    activo: {
        type: Boolean,
        required: false
    }
}, {
    collection: 'productos'
});

productoSchema.loadClass(Producto);

export const ProductoModel = mongoose.model('Producto', productoSchema);
