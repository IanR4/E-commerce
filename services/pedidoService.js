import {Pedido} from "../models/entities/pedido.js"
import PedidoRepository from "../models/repositories/pedidoRepository.js";
import UsuarioRepository from "../models/repositories/usuarioRepository.js";
import ItemPedidoCreator from "../middleware/itemPedidoCreator.js";
import { EstadoPedidoFactory } from "../models/entities/EstadoPedidoFactory.js";
import PedidoValidator from "../validators/pedidoValidator.js"
import UsuarioValidator from "../validators/usuarioValidator.js"
import { FactoryNotificacion } from "../models/entities/factoryNotificacion.js";
import { Usuario } from "../models/entities/usuario.js";

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
                                return {
                                    data: pedidoGuardado,
                                    status: 201
                                };
                            });
                    });
            });
    }

    patchPedido(pedidoId, pedidoData) {
        return this.pedidoValidator.buscarPedido(pedidoId)
            .then(pedido => {
                const usuarioId = pedidoData.usuario;
                return this.usuarioValidator.buscarUsuario(usuarioId)
                    .then(usuario => {
                        if (pedidoData.estado && pedidoData.estado !== pedido.estado) {
                            const nuevoEstado = EstadoPedidoFactory.crearEstado(pedidoData.estado);
                            if (nuevoEstado.validarTransicion(pedido, usuario)) {
                                if (typeof pedido.actualizarEstado === 'function') {
                                    pedido.actualizarEstado(pedidoData.estado, usuario, pedidoData.motivo);
                                } else {
                                    pedido.estado = pedidoData.estado;
                                }
                            }
                        }

                        return this.factoryNotificacion.crearSegunPedido(pedido)
                            .then(notificacion => {
                                if (
                                    notificacion.usuarioDestino &&
                                    typeof notificacion.usuarioDestino.recibirNotificacion === 'function'
                                ) {
                                    notificacion.usuarioDestino.recibirNotificacion(notificacion);
                                } else {
                                    console.log("No se pudo enviar la notificación: usuario destino no encontrado o inválido.");
                                }

                                return this.pedidoRepository.actualizarPedido(pedidoId, pedido)
                                    .then(pedidoRes => ({
                                        data: pedidoRes,
                                        status: 200
                                    }));
                            });
                    });
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