import { z } from "zod"
import PedidoService from "../services/pedidoService.js"
import { Moneda } from "../models/entities/moneda.js"
import { TipoUsuario } from "../models/entities/tipoUsuario.js"


const pedidoSchema = z.object({
    comprador: z.string().min(1),
    moneda: z.nativeEnum(Moneda),
    direccionEntrega: z.object(),
    items: z.array().min(1),
})

class PedidoController {
    constructor() {
        this.pedidoService = new PedidoService();
    }

    getPedido = (req, res, next) => {
        const pedidoId = parseInt(req.params.pedidoId, 10);
        if (isNaN(pedidoId)) {
            return res.status(400).json({ error: "Invalid pedidoId parameter" });
        }
        this.pedidoService.getPedido(pedidoId)
            .then(({ data, status }) => res.status(status).json(data))
            .catch(next);
    };


  postPedido = (req, res, next) => {
    //const compradorId = parseInt(req.params.comprador, 10);
    const pedidoData = req.body;
    //const resultBody = pedidoSchema.safeParse(pedidoData)
    this.pedidoService.postPedido(pedidoData)
      .then(({ data, status }) => res.status(status).json(data))
      .catch(next);
  }

  patchPedido = (req, res, next) => {
    const pedidoId = parseInt(req.params.pedidoId, 10); 
    if (isNaN(pedidoId)) {
        return res.status(400).json({ error: "Invalid pedidoId parameter" });
    }
    const pedidoData = req.body;
    this.pedidoService.patchPedido(pedidoId, pedidoData)
      .then(({ data, status }) => res.status(status).json(data))
      .catch(next);
  }


    getPedidosUsuario = (req, res, next) => {
        const usuarioId = parseInt(req.params.usuarioId, 10);
        if (isNaN(usuarioId)) {
            return res.status(400).json({ error: "Invalid usuarioId parameter" });
        }
        this.pedidoService.getPedidosUsuario(usuarioId)
            .then(({ data, status }) => res.status(status).json(data))
            .catch(next);
    };

}

export default new PedidoController();
