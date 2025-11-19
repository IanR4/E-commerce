import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL

export const login = (email, password) => {
  return axios
    .post(`${API_BASE_URL}/login`, { email, password })
    .then((response) => response.data)
}

export const register = (email, password, nombre, tipo, telefono) => {
  return axios
    .post(`${API_BASE_URL}/register`, { email, password, nombre, tipo, telefono })
    .then((response) => response.data)
}

export const getUsuario = (id) => {
  return axios
    .get(`${API_BASE_URL}/usuario/${id}`)
    .then((response) => response.data)
    .catch((error) => { return null });
}