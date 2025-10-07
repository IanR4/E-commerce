import { ProductoModel } from '../../schemas/productoSchema.js';

class ProductoRepository {
    constructor() {
        this.model = ProductoModel;
    }

    crearProducto(producto){
        const nuevoProducto = new this.model(producto);
        return nuevoProducto.save();
    }

    findById(productoId) {
        return this.model.findOne({ _id: productoId }).exec();
    }
}

export default new ProductoRepository();