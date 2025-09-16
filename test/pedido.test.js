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

  test("crea un pedido correctamente", async () => {
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
});
