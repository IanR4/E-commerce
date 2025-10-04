
import PedidoValidator from "../validators/pedidoValidator.js"
import PedidoService from "../services/pedidoService.js"

class PedidoController {
    constructor() {
        this.pedidoValidator = PedidoValidator;
        this.pedidoService = new PedidoService();
    }

    getPedido = (req, res) => {
        const pedidoId = parseInt(req.params.pedidoId, 10);
        this.pedidoValidator.validarPedidoId(pedidoId);
        this.pedidoService.getPedido(pedidoId)
            .then(({ data, status }) => res.status(status).json(data))
    };

    postPedido = (req, res) => {
        const pedidoData = req.body;
        const resultBody = this.pedidoValidator.validarPedido(pedidoData);
        this.pedidoService.postPedido(resultBody)
            .then(({ data, status }) => res.status(status).json(data))
    }

    patchPedido = (req, res) => {
        const pedidoId = parseInt(req.params.pedidoId, 10); 
        this.pedidoValidator.validarPedidoId(pedidoId);
        const pedidoData = req.body;
        this.pedidoService.patchPedido(pedidoId, pedidoData)
        .then(({ data, status }) => res.status(status).json(data))
    }

    getPedidosUsuario = (req, res) => {
        const usuarioId = parseInt(req.params.usuarioId, 10);
        this.pedidoValidator.validarUsuarioId(usuarioId);
        this.pedidoService.getPedidosUsuario(usuarioId)
            .then(({ data, status }) => res.status(status).json(data))
            .catch(next);
    };
}




export default new PedidoController();

