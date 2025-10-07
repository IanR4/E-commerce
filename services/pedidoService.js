import { EstadoPedidoEnum } from "../models/entities/estadoPedidoEnum.js";
import { EstadoPedido } from "../models/entities/estadoPedido.js";
import {Pedido} from "../models/entities/pedido.js"
import PedidoRepository from "../models/repositories/pedidoRepository.js";
import UsuarioRepository from "../models/repositories/usuarioRepository.js";
import ItemPedidoCreator from "../middleware/itemPedidoCreator.js";
import { EstadoPedidoFactory } from "../models/entities/EstadoPedidoFactory.js";
import PedidoValidator from "../validators/pedidoValidator.js"
import UsuarioValidator from "../validators/usuarioValidator.js"
import { FactoryNotificacion } from "../models/entities/factoryNotificacion.js";

export default class PedidoService {
    constructor() {
        this.pedidoValidator = PedidoValidator;
        this.usuarioValidator = UsuarioValidator;
        this.pedidoRepository = PedidoRepository;
        this.usuarioRepository = UsuarioRepository;
        this.factoryNotificacion = new FactoryNotificacion();
    }

    getPedido(pedidoId) {
        return Promise.resolve(this.pedidoValidator.buscarPedido(pedidoId))
        .then((pedidoRes) => {
            return {
                data: pedidoRes,
                status: 200
            };
        });
    }

    postPedido(pedidoData) {
        const compradorId = pedidoData.comprador;
        return this.usuarioValidator.buscarComprador(compradorId)
            .then(comprador => {
                return ItemPedidoCreator.crearItems(pedidoData.items)
                    .then(items => {
                        const nuevoPedido = new Pedido(
                            comprador._id, // o comprador según tu schema
                            items,
                            pedidoData.moneda,
                            pedidoData.direccionEntrega
                        );
                        this.pedidoValidator.validarStockPedido(nuevoPedido);
                        nuevoPedido.reducirStockItems();
                        return this.pedidoRepository.crearPedido(nuevoPedido)
                            .then(pedidoGuardado => {
                                //this.factoryNotificacion.crearNotificacionDeCreacion(pedidoGuardado);
                                return {
                                    data: pedidoGuardado,
                                    status: 201
                                };
                            });
                    });
            });
    }

    patchPedido(pedidoId, pedidoData) {
        const pedido = this.pedidoValidator.buscarPedido(pedidoId);        
        const usuarioId = parseInt(pedidoData.usuario, 10);
        const usuario = this.usuarioValidator.buscarUsuario(usuarioId);

        if(pedidoData.estado && pedidoData.estado !== pedido.estado) {
            const nuevoEstado = EstadoPedidoFactory.crearEstado(pedidoData.estado);
            if(nuevoEstado.validarTransicion(pedido, usuario, this.factoryNotificacion)) {
                pedido.actualizarEstado(pedidoData.estado, usuario, pedidoData.motivo);
            }
        }

        const notificacion = this.factoryNotificacion.crearSegunPedido(pedido);
        notificacion.usuarioDestino.recibirNotificacion(notificacion);

        return Promise.resolve(this.pedidoRepository.actualizarPedido(pedidoId, pedido))
            .then((pedidoRes) => {
                return {
                    data: pedidoRes,
                    status: 200
                };
            });
    }

    getPedidosUsuario(usuarioId) {
        const usuario = this.usuarioValidator.buscarUsuario(usuarioId);

        return Promise.resolve(this.pedidoValidator.buscarPedidoUsuario(usuario.id))
        .then((listaPedidos) => {
            return {
                data: listaPedidos,
                status: 200
            };
        });
    }
}