import {Pedido} from "../models/entities/pedido.js"
import PedidoRepository from "../models/repositories/pedidoRepository.js";
import UsuarioRepository from "../models/repositories/usuarioRepository.js";
import NotificacionRepository from "../models/repositories/notificacionRepository.js";
import ItemPedidoCreator from "../middleware/itemPedidoCreator.js";
import { EstadoPedidoFactory } from "../models/entities/estadoPedidoFactory.js";
import PedidoValidator from "../validators/pedidoValidator.js"
import UsuarioValidator from "../validators/usuarioValidator.js"
import { Notificacion } from "../models/entities/notificacion.js";

export default class PedidoService {
    constructor() {
        this.pedidoValidator = PedidoValidator;
        this.usuarioValidator = UsuarioValidator;
        this.pedidoRepository = PedidoRepository;
        this.usuarioRepository = UsuarioRepository;
        this.notificacionRepository = NotificacionRepository;
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
                            comprador._id,
                            items,
                            pedidoData.moneda,
                            pedidoData.direccionEntrega
                        );
                        
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
                            const nuevoEstadoInstancia = EstadoPedidoFactory.crearEstado(pedidoData.estado);
                            
                            return Promise.resolve(nuevoEstadoInstancia.validarTransicion(pedido, usuario))
                                .then(() => {
                                    // Actualizar el estado del pedido
                                    if (typeof pedido.actualizarEstado === 'function') {
                                        pedido.actualizarEstado(pedidoData.estado, usuario, pedidoData.motivo);
                                    } else {
                                        pedido.estado = pedidoData.estado;
                                    }

                                    const mensajeNotificacion = nuevoEstadoInstancia.generarNotificacion(pedido);
                                    const destinatarioId = nuevoEstadoInstancia.obtenerDestinatarioNotificacion(pedido);

                                    // Si el estado requiere notificación
                                    if (mensajeNotificacion && destinatarioId) {
                                        return this.usuarioRepository.findById(destinatarioId)
                                            .then(destinatario => {
                                                const notificacion = new Notificacion(destinatario, mensajeNotificacion);
                                                const notificacionData = {
                                                    usuario: destinatario._id,
                                                    mensaje: notificacion.mensaje,
                                                    leida: false
                                                };
                                                return this.notificacionRepository.crearNotificacion(notificacionData);
                                            })
                                            .then(() => pedido);
                                    }

                                    return pedido;
                                });
                        }
                        return pedido;
                    })
                    .then(pedidoProcesado => {
                        return this.pedidoRepository.actualizarPedido(pedidoId, pedidoProcesado)
                            .then(pedidoRes => ({
                                data: pedidoRes,
                                status: 200
                            }));
                    });
            });
    }

    getPedidosUsuario(usuarioId) {
        return Promise.resolve(this.pedidoValidator.buscarPedidoUsuario(usuarioId))
        .then((listaPedidos) => {
            return {
                data: listaPedidos,
                status: 200
            };
        });
    }
}