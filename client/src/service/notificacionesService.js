import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL

export const getNotificacionesLeidas = (id) => {
  return axios
    .get(`${API_BASE_URL}/usuarios/${id}/notificaciones/leidas`)
    .then((response) => response.data)
}

export const getNotificacionesNoLeidas = (id) => {
  return axios
    .get(`${API_BASE_URL}/usuarios/${id}/notificaciones/noleidas`)
    .then((response) => response.data)
}

export const leerNotificacion = (id) => {
  return axios
    .get(`${API_BASE_URL}/notificacion/${id}`)
    .then((response) => response.data)
}