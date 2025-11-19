import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL

export const getProducts = () => {
  return axios
    .get(`${API_BASE_URL}/productos`)
    .then((response) => response.data.productos)
}


export const getProductById = (id) => {
  return axios
    .get(`${API_BASE_URL}/producto/${id}`)
    .then((response) => response.data)
}

export const getProductVendedor = (vendedor_id, page = 1, limit = 9) => {
  const params = new URLSearchParams();
  if (page) params.set('page', page);
  if (limit) params.set('limit', limit);
  const qs = params.toString() ? `?${params.toString()}` : '';
  return axios
    .get(`${API_BASE_URL}/vendedores/${vendedor_id}/productos${qs}`)
    .then((response) => response.data)
}

export const postProduct = (vendedor, titulo, descripcion, categoria, precio, moneda, stock, foto) => {
  // backend expects `categorias` as an array and moneda to match its enum values
  const monedaMap = {
    'ARS': 'PesoArg',
    'ARS$': 'PesoArg',
    'ARS ': 'PesoArg',
    'PEN': 'PesoArg',
    'USD': 'DolarUsa',
    'REAL': 'Real',
    'Real': 'Real',
    'DolarUsa': 'DolarUsa',
    'PesoArg': 'PesoArg'
  }

  const monedaValue = monedaMap[moneda] || moneda || 'PesoArg'
  const categorias = categoria ? (Array.isArray(categoria) ? categoria : [categoria]) : []

  return axios
    .post(`${API_BASE_URL}/producto`, { vendedor, titulo, descripcion, categorias, precio, moneda: monedaValue, stock, foto })
    .then((response) => response.data)
}

export const patchProduct = (productoId, productoData) => {
  return axios
    .patch(`${API_BASE_URL}/producto/${productoId}`, productoData)
    .then((response) => response.data)
}

export const getProductsFiltered = (vendedor = "", titulo = "", categoria = "", descripcion = "", precioMin = "", precioMax = "", orden = "masVendidos") => {
  const queryFiltros = extraerFiltros(titulo, categoria, descripcion, precioMin, precioMax, orden)
  var rutaVendedor = vendedor?`/vendedores/${vendedor}`:``
  return axios
    .get(`${API_BASE_URL}${rutaVendedor}/productos/${queryFiltros}`)
    .then((response) => response.data.productos)
}

function extraerFiltros(titulo, categoria, descripcion, precioMin, precioMax, orden) {
  const params = new URLSearchParams();

  if (titulo) params.set("titulo", titulo);
  if (categoria) params.set("categoria", categoria);
  if (descripcion) params.set("descripcion", descripcion);
  if (precioMin) params.set("precioMin", precioMin);
  if (precioMax) params.set("precioMax", precioMax);
  if (orden) params.set("orden", orden);

  return "?" + params.toString();
}
