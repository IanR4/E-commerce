import mongoose from 'mongoose';
import { Usuario } from '../models/entities/usuario.js';
import { TipoUsuario } from '../models/entities/tipoUsuario.js';

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true,
        enum: Object.values(TipoUsuario)
    },
    fechaAlta: {
        type: Date,
        required: true,
    },
    notificaciones: {
        type: [Object],
        default: []
    },
}, {
    collection: 'usuarios'
});

usuarioSchema.loadClass(Usuario);

export const UsuarioModel = mongoose.model('Usuario', usuarioSchema);