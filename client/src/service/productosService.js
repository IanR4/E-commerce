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


export const postProduct = (titulo, descripcion, categorias, precio, moneda, stock, foto) => {
  return axios
    .post(`${API_BASE_URL}/producto`, { titulo, descripcion, categorias, precio, moneda, stock, foto })
    .then((response) => response.data)
}



