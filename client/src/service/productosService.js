import {productos} from "../mockdata/Productos";
import axios from 'axios';


export const getProductosSlowly = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve(productos)
  }, 2000)
})

const API_BASE_URL = process.env.REACT_APP_API_URL

export const getProducts = async () => {
  try{
    const response = await axios.get(`${API_BASE_URL}/productos`);
    console.log("Productos obtenidos:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo los productos", error);
    throw error;
  }
}


export const getProductById = async (id) => {
  try{
    const response = await axios.get(`${API_BASE_URL}/producto/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el producto con id: ${id}:`, error);
    throw error;
  }
}

