// Mock de ProductoModel y UsuarioModel para evitar queries reales
jest.mock("../schemas/productoSchema.js", () => ({
  __esModule: true,
  ProductoModel: class {
    constructor(data) {
      Object.assign(this, data);
    }
    save() { return Promise.resolve(this); }
    static findOne(query) { return { exec: () => Promise.resolve({ _id: 1, vendedor: 1 }) }; }
    static find(query) { return { exec: () => Promise.resolve([{ _id: 1, vendedor: 1 }]) }; }
    static findByIdAndUpdate(id, update, opts) { return { exec: () => Promise.resolve({ ...update, _id: id }) }; }
  }
}));

jest.mock("../schemas/usuarioSchema.js", () => ({
  __esModule: true,
  UsuarioModel: class {
    constructor(data) {
      Object.assign(this, data);
    }
    save() { return Promise.resolve(this); }
    static findOne(query) { return { exec: () => Promise.resolve({ _id: 1 }) }; }
    static find(query) { return { exec: () => Promise.resolve([{ _id: 1 }]) }; }
    static findByIdAndUpdate(id, update, opts) { return { exec: () => Promise.resolve({ ...update, _id: id }) }; }
  }
}));
// Mock global de mongoose para evitar cualquier lógica real
jest.mock('mongoose', () => {
  class MockSchema {
    static loadClass(cls) {}
    loadClass(cls) {}
  }
  const ObjectId = function(id) { return id; };
  MockSchema.Types = { ObjectId };
  return {
    Schema: MockSchema,
    model: () => {},
    SchemaTypes: { ObjectId },
    Types: { ObjectId },
  };
});
import NotificacionService from "../services/notificacionService.js";

// Mock del modelo de Notificación para evitar lógica real de Mongoose
jest.mock("../schemas/notificacionSchema.js", () => ({
  __esModule: true,
  NotificacionModel: class {
    constructor(data) {
      Object.assign(this, data);
    }
    save() {
      return Promise.resolve({ ...this, _id: 1 });
    }
    static findOne(query) {
      if (query._id === 1) return { exec: () => Promise.resolve({ _id: 1, usuarioDestino: 1, mensaje: "Pedido confirmado", leida: false }) };
      return { exec: () => Promise.resolve(undefined) };
    }
    static findByIdAndUpdate(id, update, opts) {
      return { exec: () => Promise.resolve({ ...update, _id: id }) };
    }
    static find(query) {
      if (query.usuario === 1) return { exec: () => Promise.resolve([{ _id: 1, usuarioDestino: 1, mensaje: "Pedido confirmado", leida: false }]) };
      return { exec: () => Promise.resolve([]) };
    }
  }
}));

const mockUsuario = { id: 1, _id: 1, nombre: "Juan", email: "juan@mail.com", telefono: "12345600", tipo: "Comprador" };
const mockNotificacion = { id: 1, _id: 1, usuarioDestino: mockUsuario._id, mensaje: "Pedido confirmado", leida: false };

jest.mock("../models/repositories/notificacionRepository.js", () => ({
  __esModule: true,
  default: {
    crearNotificacion: jest.fn((notificacion) => Promise.resolve({ ...notificacion, _id: 1 })),
    findById: jest.fn((id) => {
      if (id === mockNotificacion.id || id === mockNotificacion._id) return Promise.resolve(mockNotificacion);
      return Promise.resolve(undefined);
    }),
    findByUsuario: jest.fn((usuarioId) => {
      if (usuarioId === mockUsuario.id || usuarioId === mockUsuario._id) return Promise.resolve([mockNotificacion]);
      return Promise.resolve([]);
    }),
    findLeidasByUsuario: jest.fn((usuarioId) => Promise.resolve([mockNotificacion])),
    findNoLeidasByUsuario: jest.fn((usuarioId) => Promise.resolve([])),
    marcarComoLeida: jest.fn((id) => Promise.resolve({ ...mockNotificacion, leida: true })),
  }
}));

jest.mock("../validators/notificacionValidator.js", () => ({
  __esModule: true,
  default: {
    buscarNotificacion: jest.fn((id) => {
      if (id === mockNotificacion.id || id === mockNotificacion._id) return Promise.resolve(mockNotificacion);
      return Promise.resolve(undefined);
    }),
  }
}));

describe("NotificacionService con mocks", () => {
  let notificacionService;

  beforeEach(() => {
    notificacionService = new NotificacionService();
    jest.clearAllMocks();
  });

  test("crear una notificacion correctamente", async () => {
    const notificacionData = {
      usuarioDestino: mockUsuario._id,
      mensaje: "Pedido confirmado",
      leida: false
    };
    const res = await notificacionService.postNotificacion(notificacionData);
    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty("_id");
    expect(res.data.mensaje).toBe("Pedido confirmado");
    expect(res.data.usuarioDestino).toBe(mockUsuario._id);
    expect(res.data.leida).toBe(false);
  });

  test("consultar notificacion creada", async () => {
    const res = await notificacionService.getNotificacion(mockNotificacion.id);
    expect(res.status).toBe(200);
    expect(res.data).toEqual(mockNotificacion);
  });

  test("consultar notificacion inexistente devuelve undefined", async () => {
    const res = await notificacionService.getNotificacion(999);
    expect(res.status).toBe(200);
    expect(res.data).toBeUndefined();
  });

  test("consultar notificaciones leidas de un usuario", async () => {
    const res = await notificacionService.getNotificacionesLeidasUsuario(mockUsuario.id);
    expect(res.status).toBe(200);
    expect(res.data).toEqual([mockNotificacion]);
  });

  test("consultar notificaciones no leidas de un usuario", async () => {
    const res = await notificacionService.getNotificacionesNoLeidasUsuario(mockUsuario.id);
    expect(res.status).toBe(200);
    expect(res.data).toEqual([]);
  });

  test("marcar notificacion como leida", async () => {
    const res = await notificacionService.marcarNotificacionComoLeida(mockNotificacion.id);
    expect(res.status).toBe(200);
    expect(res.data.leida).toBe(true);
  });
});
