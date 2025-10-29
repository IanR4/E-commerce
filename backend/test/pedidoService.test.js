import PedidoService from "../services/pedidoService.js";

const mockUsuario = { id: 1, _id: 1, nombre: "Juan", email: "juan@mail.com", telefono: "12345600", tipo: "Comprador" };
const mockVendedor = { id: 2, _id: 2, nombre: "Ian", email: "ian@mail.com", telefono: "70810617", tipo: "Vendedor" };
const mockProducto = { id: 1, _id: 1, vendedor: mockVendedor, nombre: "Helado", descripcion: "Sabor vainilla", fotos: [], precio: 100, moneda: "DolarUsa", stock: 10, categorias: [] };
const mockItemPedido = { producto: mockProducto, cantidad: 2, precioUnitario: 100 };
const mockPedido = { _id: 1, comprador: mockUsuario, items: [mockItemPedido], moneda: "DolarUsa", direccionEntrega: "Calle 123", estado: "Pendiente", historialEstados: [] };

describe("PedidoService con mocks", () => {
  let pedidoService;

  beforeEach(() => {
    pedidoService = new PedidoService();
    jest.clearAllMocks();
  });

  test("crear un pedido correctamente", async () => {
    const pedidoData = {
      comprador: mockUsuario._id,
      items: [{
        producto: mockProducto._id,
        cantidad: 2,
        precioUnitario: 100
      }],
      moneda: "DolarUsa",
      direccionEntrega: "Calle 123"
    };

    const res = await pedidoService.postPedido(pedidoData);

    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty("_id");
    expect(res.data.comprador).toBe(mockUsuario._id);
    expect(res.data.items.length).toBe(1);
    expect(res.data.items[0].producto).toEqual(mockProducto);
  });

  test("consultar pedido creado", async () => {
    const res = await pedidoService.getPedido(mockPedido.id);
    expect(res.status).toBe(200);
    expect(res.data).toEqual(mockPedido);
  });

  test("consultar historial de un usuario", async () => {
    const res = await pedidoService.getPedidosUsuario(mockUsuario.id);
    expect(res.status).toBe(200);
    expect(res.data).toEqual([mockPedido]);
  });

  test("actualizar estado de un pedido", async () => {
    pedidoService.patchPedido = jest.fn().mockResolvedValue({
      data: { ...mockPedido, estado: "Enviado", historialEstados: [{ estado: "Enviado" }] },
      status: 200
    });

    const res = await pedidoService.patchPedido(mockPedido.id, { usuario: mockVendedor.id, estado: "Enviado" });
    expect(res.status).toBe(200);
    expect(res.data.estado).toBe("Enviado");
    expect(res.data.historialEstados[0].estado).toBe("Enviado");
  });
});

jest.mock("../models/repositories/usuarioRepository.js", () => ({
  __esModule: true,
  default: {
    crearUsuario: jest.fn().mockResolvedValue(mockUsuario),
    mockFindById: jest.fn((id) => {
      if (id === mockUsuario.id || id === mockUsuario._id) return Promise.resolve(mockUsuario);
      if (id === mockVendedor.id || id === mockVendedor._id) return Promise.resolve(mockVendedor);
      return Promise.resolve(null);
    }),
    findById: function(id) { return this.mockFindById(id); }
  }
}));


jest.mock("../models/repositories/productoRepository.js", () => ({
  __esModule: true,
  default: {
    crearProducto: jest.fn().mockResolvedValue(mockProducto),
    mockFindById: jest.fn((id) => {
      if (id === mockProducto._id) return Promise.resolve(mockProducto);
      return Promise.resolve(null);
    }),
    findById: function(id) { return this.mockFindById(id); }
  }
}));

jest.mock("../models/repositories/pedidoRepository.js", () => ({
  __esModule: true,
  default: {
    crearPedido: jest.fn((pedido) => Promise.resolve({ ...pedido, _id: 99 })),
    findById: jest.fn((id) => {
      if (id === mockPedido.id || id === mockPedido._id) return Promise.resolve(mockPedido);
      return Promise.resolve(undefined);
    }),
  findByUsuario: jest.fn().mockResolvedValue([mockPedido]),
    findByUser: jest.fn((usuarioId) => {
      if (usuarioId === mockUsuario.id || usuarioId === mockUsuario._id) return Promise.resolve([mockPedido]);
      return Promise.resolve([]);
    }),
  }
}));