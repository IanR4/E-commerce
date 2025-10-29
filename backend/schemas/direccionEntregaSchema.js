import mongoose from 'mongoose';

export const direccionEntregaSchema = new mongoose.Schema({
    calle: {
        type: String,
        required: true,
        trim: true
    },
    altura: {
        type: Number,
        required: true
    },
    piso: {
        type: String,
        trim: true
    },
    departamento: {
        type: String,
        trim: true
    },
    codigoPostal: {
        type: String,
        required: true,
        trim: true
    },
    ciudad: {
        type: String,
        required: true,
        trim: true
    },
    provincia: {
        type: String,
        required: true,
        trim: true
    },
    pais: {
        type: String,
        required: true,
        trim: true
    },
    lat: {
        type: Number,
        min: -90,
        max: 90
    },
    lon: {
        type: Number,
        min: -180,
        max: 180
    }
}, { _id: false });