import { PedidoModel } from '../../schemas/pedidoSchema.js';

class PedidoRepository {
    constructor() {
        this.model = PedidoModel;
    }

    crearPedido(pedidoData) {
        const nuevoPedido = new this.model(pedidoData);
        return nuevoPedido.save();
    }

    findById(pedidoId) {
        return this.model.findOne({ _id: pedidoId }).exec();
    }

    actualizarPedido(pedidoId, pedido) {
        return this.model.findByIdAndUpdate(pedidoId, pedido, { new: true }).exec();
    }

    findByUser(usuarioId) {
        return this.model.find({ comprador: usuarioId }).exec();
    }

    findByVendedor(vendedorId) {
        // buscá pedidos que tengan al menos un item cuyo productoEmbebido.vendedor sea vendedorId
        return this.model.find({ 'items.productoEmbebido.vendedor': vendedorId }).exec();
    }
}

export default new PedidoRepository();