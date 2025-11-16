import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL

export const getUsuario = (mail, name) => {
  return axios
    .get(`${API_BASE_URL}/usuario`)
    .body({email: mail, name: name})
    .then((response) => response.data)
}