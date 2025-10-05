import { EstadoPedidoEnum } from "../models/entities/estadoPedidoEnum.js";
import { EstadoPedido } from "../models/entities/estadoPedido.js";
import {Pedido} from "../models/entities/pedido.js"
import PedidoRepository from "../models/repositories/pedidoRepository.js";
import UsuarioRepository from "../models/repositories/usuarioRepository.js";
import ItemPedidoCreator from "../middleware/itemPedidoCreator.js";
import { FactoryNotificacion } from "../models/repositories/factoryNotificacion.js";
import { EstadoPedidoFactory } from "../models/entities/EstadoPedidoFactory.js";
import PedidoValidator from "../validators/pedidoValidator.js"

export default class PedidoService {
    constructor() {
        this.pedidoValidator = PedidoValidator;
        this.pedidoRepository = PedidoRepository;
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
        const comprador = this.pedidoValidator.buscarComprador(compradorId);
        const items = ItemPedidoCreator.crearItems(pedidoData.items)
        const nuevoPedido = new Pedido(
            comprador,
            items,
            pedidoData.moneda,
            pedidoData.direccionEntrega
        )
        this.pedidoValidator.validarStockPedido(nuevoPedido);
        nuevoPedido.reducirStockItems();
        const pedidoGuardado = this.pedidoRepository.crearPedido(nuevoPedido);
        this.factoryNotificacion.crearNotificacionDeCreacion(pedidoGuardado);
        return Promise.resolve({
            data: pedidoGuardado,
            status: 201
        });
    }

    patchPedido(pedidoId, pedidoData) {
        const pedido = this.pedidoValidator.buscarPedido(pedidoId);        
        const usuarioId = parseInt(pedidoData.usuario, 10);
        const usuario = this.pedidoValidator.buscarUsuario(usuarioId);

        if(pedidoData.estado && pedidoData.estado !== pedido.estado) {
            const nuevoEstado = EstadoPedidoFactory.crearEstado(pedidoData.estado);
            if(nuevoEstado.validarTransicion(pedido, usuario, this.factoryNotificacion)) {
                pedido.actualizarEstado(pedidoData.estado, usuario, pedidoData.motivo);
            }
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
        const usuario = this.pedidoValidator.buscarUsuario(usuarioId);

        return Promise.resolve(this.pedidoRepository.findByUser(usuario.id))
        .then((listaPedidos) => {
            return {
                data: listaPedidos,
                status: 200
            };
        });
    }
}