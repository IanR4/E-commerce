import PedidoService from "../services/pedidoService.js";
import UsuarioRepository from "../models/repositories/usuarioRepository.js";
import { Producto } from "../models/entities/producto.js";
import { ItemPedido } from "../models/entities/itemPedido.js";
import { Usuario } from "../models/entities/usuario.js";
import { EstadoPedido } from "../models/entities/estadoPedido.js";

let comprador1, vendedor1, producto, itemPedido;

function crearUsuarios() {
  comprador1 = new Usuario("Juan", "juan@mail.com", "12345600", "Comprador");
  UsuarioRepository.crearUsuario(comprador1);
  vendedor1 = new Usuario("Ian", "ian@mail.com", "70810617", "Vendedor");
  UsuarioRepository.crearUsuario(vendedor1);
}

function crearProductoYItem() {
  producto = new Producto(1, vendedor1, "Helado", "Sabor vainilla", [], 100, "DolarUsa", 10, [], true);
  itemPedido = new ItemPedido(producto, 2);
}


describe("PedidoService", () => {
  beforeEach(() => {
    UsuarioRepository.usuarios = [];
    UsuarioRepository.nextId = 1;
    crearUsuarios();
    crearProductoYItem();
  });

  test("crear un pedido correctamente", async () => {
    const pedidoData = {
      comprador: comprador1.id,
      items: [itemPedido],
      moneda: "DolarUsa",
      direccionEntrega: "Calle 123"
    };

    const pedidoService = new PedidoService();
    const res = await pedidoService.postPedido(pedidoData);

    expect(res.data.validarStock()).toBe(true);
    expect(producto.stock).toBe(8);
    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty("id");
    expect(res.data.comprador).toBe(comprador1);
    expect(res.data.items.length).toBe(1);
    expect(res.data.items[0].producto).toBe(producto);
    expect(res.data.items[0].producto.vendedor).toBe(vendedor1);

  });

  test("consultar pedido creado", async () => {
    const pedidoData = {
      comprador: comprador1.id,
      items: [itemPedido],
      moneda: "DolarUsa",
      direccionEntrega: "Calle 123"
    };

    const pedidoService = new PedidoService();
    const pedidoCreado = await pedidoService.postPedido(pedidoData);
    const pedidoObtenido = await pedidoService.getPedido(pedidoCreado.data.id);

    expect(pedidoObtenido.status).toBe(200);
    expect(pedidoObtenido.data).toEqual(pedidoCreado.data);
  });

  test("consultar historial de un usuario", async () => {
    const comprador2 = new Usuario("Nico", "nico@mail.com", "31958271", "Comprador");
    UsuarioRepository.crearUsuario(comprador2);

    const pedidoData1 = {
      comprador: comprador1.id,
      items: [itemPedido],
      moneda: "DolarUsa",
      direccionEntrega: "Calle 123"
    };

    const pedidoData2 = {
      comprador: comprador1.id,
      items: [itemPedido],
      moneda: "Real",
      direccionEntrega: "Calle 567"
    };

    const pedidoData3 = {
      comprador: comprador2.id,
      items: [itemPedido],
      moneda: "Real",
      direccionEntrega: "Calle 898"
    };

    const pedidoService = new PedidoService();
    const pedidoCreado1 = await pedidoService.postPedido(pedidoData1);
    const pedidoCreado2 = await pedidoService.postPedido(pedidoData2);
    const pedidoCreado3 = await pedidoService.postPedido(pedidoData3);

    const historialObtenido = await pedidoService.getPedidosUsuario(comprador1.id);

    expect(historialObtenido.status).toBe(200);
    expect(historialObtenido.data).toHaveLength(2);
    expect(historialObtenido.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining(pedidoCreado1.data),
        expect.objectContaining(pedidoCreado2.data),
      ])
    );
    expect(historialObtenido.data).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining(pedidoCreado3.data)
      ])
    );
  });

  test("actualizar estado de un pedido a enviado", async () => {
    const pedidoData = {
      comprador: comprador1.id,
      items: [itemPedido],
      moneda: "DolarUsa",
      direccionEntrega: "Calle 123"
    };

    const pedidoService = new PedidoService();
    const pedidoCreado = await pedidoService.postPedido(pedidoData);
    const actualizacionData1 = {
      usuario: vendedor1.id,
      estado: "Confirmado",
      motivo: "Pedido confirmado"
    };
    const res1 = await pedidoService.patchPedido(pedidoCreado.data.id, actualizacionData1);
    expect(res1.status).toBe(200);
    expect(res1.data.estado).toBe(EstadoPedido.Confirmado);

    const actualizacionData2 = {
      usuario: vendedor1.id,
      estado: "EnPreparacion",
      motivo: "Pedido en preparación"
    };
    const res2 = await pedidoService.patchPedido(pedidoCreado.data.id, actualizacionData2);
    expect(res2.status).toBe(200);
    expect(res2.data.estado).toBe(EstadoPedido.EnPreparacion);

    const actualizacionData3 = {
      usuario: vendedor1.id,
      estado: "Enviado",
      motivo: "Pedido enviado"
    };
    const res3 = await pedidoService.patchPedido(pedidoCreado.data.id, actualizacionData3);

    expect(res3.status).toBe(200);
    expect(pedidoCreado.data.tieneItemsDe(vendedor1)).toBe(true);
    expect(res3.data.estado).toBe(EstadoPedido.Enviado);
    expect(res3.data.historialEstados).toHaveLength(3);
    expect(res3.data.historialEstados[0].estado).toBe(EstadoPedido.Confirmado);
    expect(res3.data.historialEstados[1].estado).toBe(EstadoPedido.EnPreparacion);
    expect(res3.data.historialEstados[2].estado).toBe(EstadoPedido.Enviado);
  });

  test("cancelar un pedido", async () => {
    const pedidoData = {
      comprador: comprador1.id,
      items: [itemPedido],
      moneda: "DolarUsa",
      direccionEntrega: "Calle 123"
    };

    const pedidoService = new PedidoService();
    const pedidoCreado = await pedidoService.postPedido(pedidoData);
    const actualizacionData1 = {
      usuario: vendedor1.id,
      estado: "Confirmado",
      motivo: "Pedido confirmado"
    };
    const res1 = await pedidoService.patchPedido(pedidoCreado.data.id, actualizacionData1);
    expect(res1.status).toBe(200);
    expect(res1.data.estado).toBe(EstadoPedido.Confirmado);

    const actualizacionData2 = {
      usuario: vendedor1.id,
      estado: "Cancelado",
      motivo: "Pedido cancelado"
    };
    const res2 = await pedidoService.patchPedido(pedidoCreado.data.id, actualizacionData2);
    expect(res2.status).toBe(200);
    expect(res2.data.estado).toBe(EstadoPedido.Cancelado);
    expect(res2.data.historialEstados).toHaveLength(2);
    expect(res2.data.historialEstados[0].estado).toBe(EstadoPedido.Confirmado);
    expect(res2.data.historialEstados[1].estado).toBe(EstadoPedido.Cancelado);
  });

  test("realiza notificaciones correctamente", async () => {
    const pedidoData1 = {
      comprador: comprador1.id,
      items: [itemPedido],
      moneda: "DolarUsa",
      direccionEntrega: "Calle 123"
    };
    const pedidoData2 = {
      comprador: comprador1.id,
      items: [itemPedido],
      moneda: "Real",
      direccionEntrega: "Esquina 456"
    };

    const actualizacionData1 = {
        usuario: vendedor1.id,
        estado: "Confirmado",
    };
    const actualizacionData2 = {
        usuario: vendedor1.id,
        estado: "EnPreparacion",
    };
    const actualizacionData3 = {
        usuario: vendedor1.id,
        estado: "Enviado"
    };
    const actualizacionData4 = {
        usuario: comprador1.id,
        estado: "Cancelado",
        motivo: "testing"
    };

    const pedidoService = new PedidoService();
    const res = await pedidoService.postPedido(pedidoData1);
    const res1 = await pedidoService.patchPedido(1, actualizacionData1);
    const res2 = await pedidoService.patchPedido(1, actualizacionData2);
    const res3 = await pedidoService.patchPedido(1, actualizacionData3);
    const res4 = await pedidoService.postPedido(pedidoData2);
    const res5 = await pedidoService.patchPedido(2, actualizacionData4);

    expect(res.status).toBe(201);
    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);
    expect(res3.status).toBe(200);
    expect(res4.status).toBe(201);
    expect(res5.status).toBe(200);
    expect(pedidoService.factoryNotificacion.notificaciones.length).toBe(4);
    expect(pedidoService.factoryNotificacion.notificaciones[0].usuarioDestino).toBe(vendedor1);
    expect(pedidoService.factoryNotificacion.notificaciones[1].usuarioDestino).toBe(comprador1);
    expect(pedidoService.factoryNotificacion.notificaciones[3].usuarioDestino).toBe(vendedor1);
  });
});



