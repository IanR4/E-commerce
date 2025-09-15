import {Pedido} from "../models/entities/pedido.js"
import { PedidoRepository } from "../models/repositories/pedidoRepository.js";
import UsuarioRepository from "../models/repositories/usuarioRepository.js";

export default class PedidoService {
    constructor() {
        this.pedidoRepository = new PedidoRepository();
        this.usuarioRepository = UsuarioRepository;
    }

    getPedido(pedidoId) {
        return Promise.all([this.pedidoRepository.findById(pedidoId)])
        .then((pedidoRes) => {
            return {
                data: {
                    pedido: pedidoRes
                },
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
        const nuevoPedido = new Pedido(
            comprador,
            pedidoData.items,
            pedidoData.moneda,
            pedidoData.direccionEntrega
        )
        if(!nuevoPedido.validarStock()){
            nuevoPedido = null
            return Promise.reject({name: "StockError", message: "No hay stock suficiente para completar el pedido"});
        }
        const pedidoGuardado = this.pedidoRepository.crearPedido(nuevoPedido);
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
        // Falta chequear que el vendedor venda los productos del pedido
        

        //SWITCH DE ESTADOS
        if(pedidoData.estado) {
            pedido.actualizarEstado(pedidoData.estado, usuario, pedidoData.motivo);
        }

        return Promise.all([this.pedidoRepository.actualizarPedido(pedidoId, pedido)])
         .then((pedidoRes) => {
             return {
                 data: pedidoRes,
                 status: 200
             };
         });
    }

    getPedidosUsuario(usuarioId) {
        return Promise.all([this.pedidoRepository.findByUser(usuarioId)])
        .then((listaPedidos) => {
            return {
                data: {
                    pedidos: listaPedidos
                },
                status: 200
            };
        });
    }
}

