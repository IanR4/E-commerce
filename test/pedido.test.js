import PedidoService from "../services/pedidoService.js";
import UsuarioRepository from "../models/repositories/usuarioRepository.js";
import { Producto } from "../models/entities/producto.js";
import { ItemPedido } from "../models/entities/itemPedido.js";
import { Usuario } from "../models/entities/usuario.js";

describe("PedidoService", () => {
  beforeEach(() => {
    // Limpiar repositorios antes de cada test
    UsuarioRepository.usuarios = [];
    UsuarioRepository.nextId = 1;
  });

  test("crear un pedido correctamente", async () => {
    // Crear usuario y agregarlo al repositorio
    const comprador1 = new Usuario("Juan", "juan@mail.com", "12345600", "Comprador");
    UsuarioRepository.crearUsuario(comprador1);
    const vendedor1 = new Usuario("Ian", "ian@mail.com", "70810617", "Vendedor");
    UsuarioRepository.crearUsuario(vendedor1);

    // Crear producto
    const producto = new Producto(1, vendedor1, "Jabon", "Sabor vainilla", [], 100, "DolarUsa", 10, [], true);

    // Crear itemPedido
    const itemPedido = new ItemPedido(producto, 2, producto.precio);

    // Datos para el pedido
    const pedidoData = {
      comprador: comprador1.id,
      items: [itemPedido],
      moneda: "DolarUsa",
      direccionEntrega: "Calle 123"
    };

    const pedidoService = new PedidoService();
    const res = await pedidoService.postPedido(pedidoData);

    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty("id");
    expect(res.data.comprador).toBe(comprador1);
    expect(res.data.items.length).toBe(1);
    expect(res.data.items[0].producto).toBe(producto);
    expect(res.data.items[0].producto.vendedor).toBe(vendedor1);

  });

  test("consultar pedido creado", async () => {
    // Crear usuario y agregarlo al repositorio
    const comprador1 = new Usuario("Juan", "juan@mail.com", "12345600", "Comprador");
    UsuarioRepository.crearUsuario(comprador1);
    const vendedor1 = new Usuario("Ian", "ian@mail.com", "70810617", "Vendedor");
    UsuarioRepository.crearUsuario(vendedor1);

    // Crear producto
    const producto = new Producto(1, vendedor1, "Jabon", "Sabor vainilla", [], 100, "DolarUsa", 10, [], true);

    // Crear itemPedido
    const itemPedido = new ItemPedido(producto, 2, producto.precio);

    // Datos para el pedido
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
    // Crear usuarios y agregarlos al repositorio
    const comprador1 = new Usuario("Juan", "juan@mail.com", "12345600", "Comprador");
    UsuarioRepository.crearUsuario(comprador1);
    const comprador2 = new Usuario("Nico", "nico@mail.com", "31958271", "Comprador");
    UsuarioRepository.crearUsuario(comprador2);

    const vendedor1 = new Usuario("Ian", "ian@mail.com", "70810617", "Vendedor");
    UsuarioRepository.crearUsuario(vendedor1);

    // Crear producto
    const producto = new Producto(1, vendedor1, "Jabon", "Sabor vainilla", [], 100, "DolarUsa", 10, [], true);

    // Crear itemPedido
    const itemPedido = new ItemPedido(producto, 2, producto.precio);

    // Datos para los pedidos
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
});