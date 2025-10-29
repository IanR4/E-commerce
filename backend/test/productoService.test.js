import ProductoService from "../services/productoService.js";

const vendedorObjectId = "507f1f77bcf86cd799439011";
const mockVendedor = { id: vendedorObjectId, _id: vendedorObjectId, nombre: "Ian", email: "ian@mail.com", telefono: "70810617", tipo: "Vendedor" };
const mockProducto = { id: 1, _id: 1, vendedor: vendedorObjectId, titulo: "Helado", descripcion: "Sabor vainilla", fotos: [], precio: 100, moneda: "DolarUsa", stock: 10, categorias: [] };


describe("ProductoService con mocks", () => {
  let productoService;

  beforeEach(() => {
    productoService = new ProductoService();
    jest.clearAllMocks();
  });

  test("crear un producto correctamente", async () => {
    const productoData = {
    vendedor: vendedorObjectId,
    titulo: "Helado",
      descripcion: "Sabor vainilla",
      foto: "",
      precio: 100,
      moneda: "DolarUsa",
      stock: 10,
      categorias: []
    };
    const res = await productoService.postProducto(productoData);
    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty("_id");
  expect(res.data.titulo).toBe("Helado");
    expect(res.data.precio).toBe(100);
    expect(res.data.vendedor).toBe(mockVendedor._id);
  });

  test("consultar producto creado", async () => {
    const res = await productoService.getProducto(mockProducto.id);
    expect(res.status).toBe(200);
    expect(res.data).toEqual(mockProducto);
  });

  test("consultar producto inexistente devuelve undefined", async () => {
    const res = await productoService.getProducto(999);
    expect(res.status).toBe(200);
    expect(res.data).toBeUndefined();
  });

  test("consultar productos de un vendedor", async () => {
    const res = await productoService.getProductosPorVendedor(mockVendedor.id, { page: 1, limit: 10 }, {});
    expect(res.status).toBe(200);
    expect(res.data).toEqual([mockProducto]);
  });
});



jest.mock("../validators/usuarioValidator.js", () => ({
  __esModule: true,
  default: {
    validarUsuarioId: jest.fn(),
    buscarVendedor: jest.fn((id) => Promise.resolve(mockVendedor)),
  }
}));
jest.mock("../schemas/productoSchema.js", () => ({
  __esModule: true,
  ProductoModel: class {
    constructor(data) { Object.assign(this, data); }
    save() { return Promise.resolve(this); }
    static findOne() { return Promise.resolve(null); }
  }
}));


jest.mock("../models/repositories/productoRepository.js", () => ({
  __esModule: true,
  default: {
    crearProducto: jest.fn((producto) => Promise.resolve({ ...producto, _id: 1 })),
    findById: jest.fn((id) => {
      if (id === mockProducto.id || id === mockProducto._id) return Promise.resolve(mockProducto);
      return Promise.resolve(undefined);
    }),
    findByVendedor: jest.fn((vendedorId) => {
      if (vendedorId === mockVendedor.id || vendedorId === mockVendedor._id) return Promise.resolve([mockProducto]);
      return Promise.resolve([]);
    }),
  }
}));
