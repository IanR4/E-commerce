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

export const getProductVendedor = (vendedor_id) => {
  return axios
    .get(`${API_BASE_URL}/vendedores/${vendedor_id}/productos`)
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



