import {productos} from "../mockdata/Productos";

export const getProductosSlowly = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve(productos)
  }, 2000)
})

