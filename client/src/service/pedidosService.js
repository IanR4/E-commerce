import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL

export const getPedidoUsuario = (usuarioId) => {
  return axios
    .get(`${API_BASE_URL}/usuarios/${usuarioId}/pedidos`)
    .then((response) => response.data)
}

export const getPedidosVendedor = (vendedorId) => {
  return axios
    .get(`${API_BASE_URL}/vendedores/${vendedorId}/pedidos`)
    .then((response) => response.data)
}

export const postPedido = (body) => {
    return axios
        .post(`${API_BASE_URL}/pedido`, body)
        .then((response) => response.data)
}

export const patchPedido = (pedidoId, body) => {
  return axios
    .patch(`${API_BASE_URL}/pedido/${pedidoId}`, body)
    .then((response) => response.data)
}