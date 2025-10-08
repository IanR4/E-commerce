import UsuarioService from "../services/usuarioService.js";

const mockUsuario = { id: 1, _id: 1, nombre: "Juan", email: "juan@mail.com", telefono: "12345600", tipo: "Comprador" };

jest.mock("../models/repositories/usuarioRepository.js", () => ({
  __esModule: true,
  default: {
    crearUsuario: jest.fn((usuario) => Promise.resolve({ ...usuario, _id: 1 })),
    findById: jest.fn((id) => {
      if (id === mockUsuario.id || id === mockUsuario._id) return Promise.resolve(mockUsuario);
      return Promise.resolve(undefined);
    }),
  }
}));

jest.mock("../validators/usuarioValidator.js", () => ({
  __esModule: true,
  default: {
    buscarUsuario: jest.fn((id) => {
      if (id === mockUsuario.id || id === mockUsuario._id) return Promise.resolve(mockUsuario);
      return Promise.resolve(undefined);
    }),
  }
}));

describe("UsuarioService con mocks", () => {
  let usuarioService;

  beforeEach(() => {
    usuarioService = new UsuarioService();
    jest.clearAllMocks();
  });

  test("crear un usuario correctamente", async () => {
    const usuarioData = {
      nombre: "Juan",
      email: "juan@mail.com",
      telefono: "12345600",
      tipo: "Comprador"
    };
    const res = await usuarioService.postUsuario(usuarioData);
    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty("_id");
    expect(res.data.nombre).toBe("Juan");
    expect(res.data.email).toBe("juan@mail.com");
    expect(res.data.telefono).toBe("12345600");
    expect(res.data.tipo).toBe("Comprador");
  });

  test("consultar usuario creado", async () => {
    const res = await usuarioService.getUsuario(mockUsuario.id);
    expect(res.status).toBe(200);
    expect(res.data).toEqual(mockUsuario);
  });

  test("consultar usuario inexistente devuelve undefined", async () => {
    const res = await usuarioService.getUsuario(999);
    expect(res.status).toBe(200);
    expect(res.data).toBeUndefined();
  });
});