import { PedidoModel } from '../../schemas/pedidoSchema.js';

export class PedidoRepository {
    constructor() {
        this.model = PedidoModel;
    }

    crearPedido(pedidoData) {
        const pedido = new this.model(pedidoData);
        return pedido.save();
    }

    actualizarPedido(pedidoId, pedidoData) {
        return this.model.findByIdAndUpdate(
            pedidoId,
            pedidoData,
            { new: true, runValidators: true }
        ).exec();
    }

    findById(pedidoId) {
        return this.model.findById(pedidoId)
            .populate('comprador')
            .populate('items.producto')
            .populate('direccionEntrega')
            .populate('historialEstados.usuario')
            .exec();
    }

    findByUser(usuarioId) {
        return this.model.find({ comprador: usuarioId })
            .sort({ fechaCreacion: -1 })
            .populate('items.producto')
            .exec();
    }

    eliminarPedido(pedidoId) {
        return this.model.findByIdAndDelete(pedidoId).exec();
    }

    listarPedidos(filtro = {}) {
        return this.model.find(filtro)
            .sort({ fechaCreacion: -1 })
            .populate('comprador')
            .populate('items.producto')
            .exec();
    }
}
