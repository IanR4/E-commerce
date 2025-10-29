import UsuarioValidator from "../validators/usuarioValidator.js"
import PedidoValidator from "../validators/pedidoValidator.js"
import PedidoService from "../services/pedidoService.js"

class PedidoController {
    constructor() {
        this.usuarioValidator = UsuarioValidator;
        this.pedidoValidator = PedidoValidator;
        this.pedidoService = new PedidoService();
    }

    getPedido = (req, res) => {
        const pedidoId = req.params.pedidoId;
        this.pedidoValidator.validarPedidoId(pedidoId);
        return this.pedidoService.getPedido(pedidoId)
            .then(({ data, status }) => res.status(status).json(data))
    };

    postPedido = (req, res) => {
        const pedidoData = req.body;
        const resultBody = this.pedidoValidator.validarPedido(pedidoData);
        return this.pedidoService.postPedido(resultBody)
            .then(({ data, status }) => res.status(status).json(data))
    }

    patchPedido = (req, res, next) => {
        const pedidoId = req.params.pedidoId; 
        this.pedidoValidator.validarPedidoId(pedidoId);
        const pedidoData = req.body;
        return this.pedidoService.patchPedido(pedidoId, pedidoData)
            .then(({ data, status }) => res.status(status).json(data))
            .catch(next); 
    }

    getPedidosUsuario = (req, res) => {
        const usuarioId = req.params.usuarioId;
        this.usuarioValidator.validarUsuarioId(usuarioId);
        return this.pedidoService.getPedidosUsuario(usuarioId)
            .then(({ data, status }) => res.status(status).json(data))
    };
}

export default new PedidoController();

