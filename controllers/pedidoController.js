import { z } from "zod"
import PedidoService from "../services/pedidoService.js"
import { Moneda } from "../models/entities/moneda.js"
import { TipoUsuario } from "../models/entities/tipoUsuario.js"

/*
export class PedidoController {
    constructor(pedidoService) {
        this.pedidoService = pedidoService
    }

    crear(req, res, next) {
        const body = req.body
        const resultBody = pedidoSchema.safeParse(body)

        if(resultBody.error) {
            res.status(400).json(resultBody.error.issues)
            return
        }

        const nuevoPedido = this.pedidoService.crear(resultBody.data);
        res.status(201).json(nuevoPedido);
    }
}
*/
const pedidoSchema = z.object({
    /*
    comprador: z.object({
        id: z.string(),
        nombre: z.string().min(3).max(50),
        email: z.string().email(),
        telefono: z.string().min(8).max(15),
        tipo: z.nativeEnum(TipoUsuario),
        fechaAlta: z.date()
    }),
    */
    moneda: z.nativeEnum(Moneda),
    /*
    direccionEntrega: z.object({
        calle: z.string().min(3),
        altura: z.string().min(1),
        piso: z.string().optional(),
        departamento: z.string().optional(),
        codigoPostal: z.string().min(4).max(10),
        ciudad: z.string().min(2),
        provincia: z.string().min(2),
        pais: z.string().min(2),
        lat: z.string(),
        lon: z.string()
    }),
    */
    /*
    items: z.array(z.object({
        producto: z.object({
            id: z.number().nonnegative(),
            vendedor: z.object({
                id: z.string(),
                nombre: z.string().min(3).max(50),
                email: z.string().email(),
                telefono: z.string().min(8).max(15),
                tipo: z.nativeEnum(TipoUsuario),
                fechaAlta: z.date()
            }),
            titulo: z.string().min(1),
            descripcion: z.string().min(1),
            categorias: z.array(z.object({
                nombre: z.string().min(1)
            })).min(1),
            precio: z.number().nonnegative(),
            moneda: z.nativeEnum(Moneda),
            stock: z.number().nonnegative(),
            fotos: z.array(z.string().url()),
            activo: z.boolean()
        }),
        cantidad: z.number().nonnegative(),
        precioUnitario: z.number().nonnegative()
    })).min(1),
    */
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
    const pedidoData = req.body;
    //const resultBody = pedidoSchema.safeParse(pedidoData)
    this.pedidoService.postPedido(pedidoData)
      .then(({ data, status }) => res.status(status).json(data))
      .catch(next);
  }

  patchPedido = (req, res, next) => {
    const pedidoId = parseInt(req.params.pedidoId, 10); 
    const pedidoData = req.body;
    this.pedidoService.patchPedido(pedidoId, pedidoData)
      .then(({ data, status }) => res.status(status).json(data))
      .catch(next);
  }
}

export default new PedidoController();
