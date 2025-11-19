import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL

export const getUsuario = (id) => {
  return axios
    .get(`${API_BASE_URL}/usuario/${id}`)
    .then((response) => response.data)
    .catch((error) => { return null });
}