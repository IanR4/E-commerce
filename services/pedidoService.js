import { EstadoPedido } from "../models/entities/estadoPedido.js";
import {Pedido} from "../models/entities/pedido.js"
import { PedidoRepository } from "../models/repositories/pedidoRepository.js";
import UsuarioRepository from "../models/repositories/usuarioRepository.js";
import ItemPedidoCreator from "../middleware/itemPedidoCreator.js";
import { FactoryNotificacion } from "../models/repositories/factoryNotificacion.js";

export default class PedidoService {
    constructor() {
        this.pedidoRepository = new PedidoRepository();
        this.usuarioRepository = UsuarioRepository;
        this.factoryNotificacion = new FactoryNotificacion();
    }

    getPedido(pedidoId) {
        return Promise.resolve(this.pedidoRepository.findById(pedidoId))
        .then((pedidoRes) => {
            return {
                data: pedidoRes,
                status: 200
            };
        });
    }

    postPedido(pedidoData) {
        const compradorId = parseInt(pedidoData.comprador, 10);
        const comprador = UsuarioRepository.findById(compradorId);
        if(!comprador) {
            return Promise.reject({name: "NotFoundError", message: "Comprador no encontrado"});
        }
        const items = ItemPedidoCreator.crearItems(pedidoData.items)
        const nuevoPedido = new Pedido(
            comprador,
            items,
            pedidoData.moneda,
            pedidoData.direccionEntrega
        )
        if(!nuevoPedido.validarStock()){
            nuevoPedido = null
            return Promise.reject({name: "StockError", message: "No hay stock suficiente para completar el pedido"});
        }
        nuevoPedido.reducirStockItems();
        const pedidoGuardado = this.pedidoRepository.crearPedido(nuevoPedido);
        this.factoryNotificacion.crearNotificacionDeCreacion(pedidoGuardado);
        return Promise.resolve({
            data: pedidoGuardado,
            status: 201
        });
    }

    patchPedido(pedidoId, pedidoData) {
        const pedido = this.pedidoRepository.findById(pedidoId);
        if(!pedido) {
            return Promise.reject({name: "NotFoundError", message: "Pedido no encontrado"});
        }
        
        const usuarioId = parseInt(pedidoData.usuario, 10);
        const usuario = UsuarioRepository.findById(usuarioId);
        if(!usuario) {
            return Promise.reject({name: "NotFoundError", message: "Usuario no encontrado"});
        }

        if(pedidoData.estado && pedidoData.estado !== pedido.estado) {
            switch(pedidoData.estado) {
                case EstadoPedido.Confirmado:
                    if(pedido.estado !== EstadoPedido.Pendiente) {
                        return Promise.reject({name: "StateError", message: "El pedido no puede ser confirmado"});
                    }
                    break;
                case EstadoPedido.EnPreparacion:
                    if(pedido.estado !== EstadoPedido.Confirmado) {
                        return Promise.reject({name: "StateError", message: "El pedido no puede ser preparado"});
                    }
                    break;
                case EstadoPedido.Enviado:
                    if(pedido.estado !== EstadoPedido.EnPreparacion) { 
                        return Promise.reject({name: "StateError", message: "El pedido no puede ser enviado"});
                    }
                    this.factoryNotificacion.crearNotificacionDeEnviado(pedido);
                    if(!pedido.tieneItemsDe(usuario)) {
                        return Promise.reject({name: "SellerError", message: "El usuario no vende los productos de este pedido"});
                    }
                    break;
                case EstadoPedido.Entregado:
                    if(pedido.estado !== EstadoPedido.Enviado) { 
                        return Promise.reject({name: "StateError", message: "El pedido no puede ser entregado"});
                    }
                    break;
                case EstadoPedido.Cancelado:
                    if(pedido.estado === EstadoPedido.Enviado || pedido.estado === EstadoPedido.Entregado) { 
                        return Promise.reject({name: "StateError", message: "El pedido no puede ser cancelado"});
                    }
                    this.factoryNotificacion.crearNotificacionDeCancelacion(pedido);
                    break;
                default:
                    return Promise.reject({name: "StateError", message: "Estado no válido"});
            }
        pedido.actualizarEstado(pedidoData.estado, usuario, pedidoData.motivo);
    }

        return Promise.resolve(this.pedidoRepository.actualizarPedido(pedidoId, pedido))
         .then((pedidoRes) => {
             return {
                 data: pedidoRes,
                 status: 200
             };
         });
    }

    getPedidosUsuario(usuarioId) {
        const usuario = this.usuarioRepository.findById(usuarioId);

        if(!usuario) {
            return Promise.reject({name: "NotFoundError", message: "Usuario no encontrado"});
        }

        return Promise.resolve(this.pedidoRepository.findByUser(usuario.id))
        .then((listaPedidos) => {
            return {
                data: listaPedidos,
                status: 200
            };
        });
    }
}