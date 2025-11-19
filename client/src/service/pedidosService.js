import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL

export const postPedido = (body) => {
    return axios
        .post(`${API_BASE_URL}/pedido`, body)
        .then((response) => response.data)
}