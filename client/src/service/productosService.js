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

