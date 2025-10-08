import {Pedido} from "../models/entities/pedido.js"
import PedidoRepository from "../models/repositories/pedidoRepository.js";
import UsuarioRepository from "../models/repositories/usuarioRepository.js";
import NotificacionRepository from "../models/repositories/notificacionRepository.js";
import ItemPedidoCreator from "../middleware/itemPedidoCreator.js";
import { EstadoPedidoFactory } from "../models/entities/estadoPedidoFactory.js";
import PedidoValidator from "../validators/pedidoValidator.js"
import UsuarioValidator from "../validators/usuarioValidator.js"
import { FactoryNotificacion } from "../models/entities/factoryNotificacion.js";
// import { FactoryNotificacion } from "../models/entities/factoryNotificacion.js"; // Eliminado: ya no se usa notificación
// import { Usuario } from "../models/entities/usuario.js";

export default class PedidoService {
    constructor() {
        this.pedidoValidator = PedidoValidator;
        this.usuarioValidator = UsuarioValidator;
        this.pedidoRepository = PedidoRepository;
        this.usuarioRepository = UsuarioRepository;
        this.notificacionRepository = NotificacionRepository;
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
                            comprador._id,
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
                            const nuevoEstadoInstancia = EstadoPedidoFactory.crearEstado(pedidoData.estado);
                            return Promise.resolve(nuevoEstadoInstancia.validarTransicion(pedido, usuario))
                                .then(() => {
                                    if (typeof pedido.actualizarEstado === 'function') {
                                        pedido.actualizarEstado(pedidoData.estado, usuario, pedidoData.motivo);
                                    } else {
                                        pedido.estado = pedidoData.estado;
                                    }
                                    return pedido;
                                });
                        }
                        return pedido; // No cambia el estado
                    })
                    .then(pedidoProcesado => {
                        // Crear la notificación y guardarla en la base de datos
                        return this.factoryNotificacion.crearSegunPedido(pedidoProcesado)
                            .then(notificacion => {
                                if (notificacion) {
                                    // Si el destinatario es un objeto usuario, obtener su id
                                    const usuarioDestino = notificacion.usuarioDestino?._id || notificacion.usuarioDestino || notificacion.usuario;
                                    const notificacionData = {
                                        usuario: usuarioDestino,
                                        mensaje: notificacion.mensaje,
                                        leida: false
                                    };
                                    return this.notificacionRepository.crearNotificacion(notificacionData);
                                }
                                return null;
                            })
                            .then(() => {
                                // Actualizar el pedido después de crear la notificación
                                return this.pedidoRepository.actualizarPedido(pedidoId, pedidoProcesado)
                                    .then(pedidoRes => ({
                                        data: pedidoRes,
                                        status: 200
                                    }));
                            });
                    });
            });
    }

    //  patchPedido(pedidoId, pedidoData) {
    //     return this.pedidoValidator.buscarPedido(pedidoId)
    //         .then(pedido => {
    //             const usuarioId = pedidoData.usuario;
    //             return this.usuarioValidator.buscarUsuario(usuarioId)
    //                 .then(usuario => {
    //                     if (pedidoData.estado && pedidoData.estado !== pedido.estado) {
    //                         let nuevoEstadoInstancia;
    //                         nuevoEstadoInstancia = EstadoPedidoFactory.crearEstado(pedidoData.estado);
    //                         return Promise.resolve(nuevoEstadoInstancia.validarTransicion(pedido, usuario))
    //                             .then(() => {
    //                                 if (typeof pedido.actualizarEstado === 'function') {
    //                                     pedido.actualizarEstado(pedidoData.estado, usuario, pedidoData.motivo);
    //                                 }
    //                                 return pedido;
    //                             })
    //                     }
    //                     return pedido; // No cambia estado
    //                 })
    //                 .then(pedidoProcesado => {
    //                     return this.factoryNotificacion.crearSegunPedido(pedidoProcesado)
    //                         .then(notificacion => {
    //                             if (
    //                                 notificacion &&
    //                                 notificacion.usuarioDestino &&
    //                                 typeof notificacion.usuarioDestino.recibirNotificacion === 'function'
    //                             ) {
    //                                 notificacion.usuarioDestino.recibirNotificacion(notificacion);
    //                             }
    //                             return this.pedidoRepository.actualizarPedido(pedidoId, pedidoProcesado)
    //                                 .then(pedidoRes => ({
    //                                     data: pedidoRes,
    //                                     status: 200
    //                                 }));
    //                         });
    //                 });
    //         });
    // }

    

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