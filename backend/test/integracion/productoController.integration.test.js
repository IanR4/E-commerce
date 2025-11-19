import request from 'supertest';

// Mocks must be defined before importing the app so that modules used by services are mocked
const vendedorObjectId = "507f1f77bcf86cd799439011";
const mockVendedor = { id: vendedorObjectId, _id: vendedorObjectId, nombre: "Ian", email: "ian@mail.com", telefono: "70810617", tipo: "Vendedor" };
const mockProducto = { id: 1, _id: 1, vendedor: vendedorObjectId, titulo: "Helado", descripcion: "Sabor vainilla", fotos: [], precio: 100, moneda: "DolarUsa", stock: 10, categorias: [] };

jest.mock('../../validators/usuarioValidator.js', () => ({
	__esModule: true,
	default: {
		validarUsuarioId: jest.fn(),
		buscarVendedor: jest.fn(() => Promise.resolve(mockVendedor)),
	}
}));

jest.mock('../../validators/productoValidator.js', () => ({
	__esModule: true,
	default: {
		validarProducto: jest.fn((p) => p),
		validarProductoId: jest.fn(),
		buscarProducto: jest.fn((id) => Promise.resolve(mockProducto)),
	}
}));

jest.mock('../../models/repositories/productoRepository.js', () => ({
	__esModule: true,
	default: {
		findByFiltros: jest.fn(() => Promise.resolve([mockProducto])),
		findById: jest.fn((id) => {
			if (Number(id) === mockProducto.id || id === mockProducto._id) return Promise.resolve(mockProducto);
			return Promise.resolve(undefined);
		}),
		crearProducto: jest.fn((producto) => Promise.resolve({ ...producto, _id: 1 })),
		findByVendedor: jest.fn(() => Promise.resolve([mockProducto])),
		eliminar: jest.fn(() => Promise.resolve()),
		actualizar: jest.fn((id, data) => Promise.resolve({ ...mockProducto, ...data })),
	}
}));

import app from '../../app.js';

describe('ProductoController - integración (con mocks)', () => {
	test('GET /productos devuelve lista paginada', async () => {
		const res = await request(app).get('/productos');
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('productos');
		expect(Array.isArray(res.body.productos)).toBe(true);
		expect(res.body.productos[0]).toMatchObject({ titulo: 'Helado' });
	});

	test('GET /producto/:productoId devuelve producto', async () => {
		const res = await request(app).get('/producto/1');
		expect(res.status).toBe(200);
		expect(res.body).toMatchObject({ titulo: 'Helado' });
	});

	test('POST /producto crea producto y devuelve 201', async () => {
		const nuevo = {
			vendedor: vendedorObjectId,
			titulo: 'Helado',
			descripcion: 'Sabor vainilla',
			foto: '',
			precio: 100,
			moneda: 'DolarUsa',
			stock: 10,
			categorias: []
		};

		const res = await request(app).post('/producto').send(nuevo);
		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty('_id');
		expect(res.body.titulo).toBe('Helado');
	});

	test('GET /vendedores/:vendedorId/productos devuelve productos del vendedor', async () => {
		const res = await request(app).get(`/vendedores/${vendedorObjectId}/productos`);
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('productos');
		expect(res.body.productos[0]).toMatchObject({ vendedor: vendedorObjectId });
	});

	test('DELETE /producto/:productoId elimina producto existente', async () => {
		const res = await request(app).delete('/producto/1');
		expect(res.status).toBe(200);
		expect(res.body).toEqual(expect.objectContaining({ message: 'Producto eliminado' }));
	});

	test('DELETE /producto/:productoId devuelve 404 si no existe', async () => {
		// mock findById to return undefined for this case
		const ProductoRepository = (await import('../../models/repositories/productoRepository.js')).default;
		ProductoRepository.findById.mockImplementationOnce(() => Promise.resolve(undefined));

		const res = await request(app).delete('/producto/999');
		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty('message');
	});

	test('PATCH /producto/:productoId actualiza producto', async () => {
		const cambios = { titulo: 'Helado cambiado' };
		const res = await request(app).patch('/producto/1').send(cambios);
		expect(res.status).toBe(200);
		expect(res.body).toMatchObject({ titulo: 'Helado cambiado' });
	});
});

