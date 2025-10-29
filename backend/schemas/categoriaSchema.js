import mongoose from 'mongoose';

export const categoriaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    }
}, { _id: false });