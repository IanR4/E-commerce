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

export const getNotificacionesLeidas = (id) => {
  return axios
    .get(`${API_BASE_URL}/usuarios/68e636efd15618341978b277/notificaciones/leidas`)
    .then((response) => response.data)
}

export const getProductsFiltered = (vendedor, titulo, categoria, descripcion, precioMin, precioMax, orden) => {
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