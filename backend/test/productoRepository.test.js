import ProductoRepository from "../models/repositories/productoRepository.js";

describe("ProductoRepository - ordenarProductos masVendidos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("ordenarProductos con 'masVendidos' llama a aggregate con $match y $sort por ventasTotal", async () => {
    const mockQuery = { vendedor: '507f1f77bcf86cd799439011' };
    const mockAggRes = [
      { _id: 'p1', titulo: 'Producto A', ventasTotal: 200 },
      { _id: 'p2', titulo: 'Producto B', ventasTotal: 100 }
    ];

    ProductoRepository.model = {
      aggregate: jest.fn(() => ({ exec: () => Promise.resolve(mockAggRes) })),
      hydrate: jest.fn((d) => d)
    };

    const res = await ProductoRepository.ordenarProductos(mockQuery, 'masVendidos');

    expect(ProductoRepository.model.aggregate).toHaveBeenCalledTimes(1);
    const calledPipeline = ProductoRepository.model.aggregate.mock.calls[0][0];

    expect(calledPipeline[0]).toEqual({ $match: mockQuery });

    const sortStage = calledPipeline.find(stage => stage.$sort);
    expect(sortStage).toBeDefined();
    expect(sortStage.$sort).toEqual({ ventasTotal: -1 });

    expect(res).toEqual(mockAggRes);
  });

  test("findByVendedor delega a ordenarProductos con orden 'masVendidos'", async () => {
    const filtros = { orden: 'masVendidos' };
    const mockReturn = [{ _id: 'p1', ventasTotal: 50 }];

  const vendorId = '507f1f77bcf86cd799439011';
  const spy = jest.spyOn(ProductoRepository, 'ordenarProductos').mockResolvedValue(mockReturn);

  const res = await ProductoRepository.findByVendedor(vendorId, filtros);

  expect(spy).toHaveBeenCalled();
  const calledQuery = spy.mock.calls[0][0];
  expect(calledQuery).toHaveProperty('vendedor');
  // Si se convierte a ObjectId, su toString debe ser igual al id original
  expect(String(calledQuery.vendedor)).toBe(vendorId);
  expect(res).toEqual(mockReturn);

  spy.mockRestore();
  });

  test("ordenarProductos con 'precioAsc' usa find().sort({precio:1}).exec()", async () => {
    const mockQuery = { vendedor: '507f1f77bcf86cd799439011' };
    const mockRes = [
      { _id: 'p1', titulo: 'Producto Barato', precio: 10 },
      { _id: 'p2', titulo: 'Producto Caro', precio: 100 }
    ];

    const sortMock = jest.fn(() => ({ exec: () => Promise.resolve(mockRes) }));
    const findMock = jest.fn(() => ({ sort: sortMock }));

    ProductoRepository.model = { find: findMock };

    const res = await ProductoRepository.ordenarProductos(mockQuery, 'precioAsc');

    expect(ProductoRepository.model.find).toHaveBeenCalledWith(mockQuery);
    expect(sortMock).toHaveBeenCalledWith({ precio: 1 });
    expect(res).toEqual(mockRes);
  });

  test("ordenarProductos con 'precioDesc' usa find().sort({precio:-1}).exec()", async () => {
    const mockQuery = { vendedor: '507f1f77bcf86cd799439011' };
    const mockRes = [
      { _id: 'p2', titulo: 'Producto Caro', precio: 100 },
      { _id: 'p1', titulo: 'Producto Barato', precio: 10 }
    ];

    const sortMock = jest.fn(() => ({ exec: () => Promise.resolve(mockRes) }));
    const findMock = jest.fn(() => ({ sort: sortMock }));

    ProductoRepository.model = { find: findMock };

    const res = await ProductoRepository.ordenarProductos(mockQuery, 'precioDesc');

    expect(ProductoRepository.model.find).toHaveBeenCalledWith(mockQuery);
    expect(sortMock).toHaveBeenCalledWith({ precio: -1 });
    expect(res).toEqual(mockRes);
  });
});
