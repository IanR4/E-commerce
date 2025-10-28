import { Outlet } from "react-router";
import Navbar from "../../components/headers/Navbar.jsx";
import { useState, useEffect } from "react";
import { getProductosSlowly } from "../../service/productosService.js";
import { getProducts } from "../../service/productosService.js";

const Layout = ({carrito}) => {
  const [productos, setProductos] = useState([]);

    const cargarProductos = async () => {
      try {
        const productosCargados = await getProducts();
        console.log("Productos cargados:", productosCargados);
        setProductos(productosCargados)
      } catch (error) {
        console.error('Error cargando productos en Layout:', error);
        // Mantener productos como [] o mostrar fallback en la UI
        setProductos([]);
      }
    }

    // Para que cuando se monte el componente los cargue
    useEffect(() => {
      cargarProductos()
    }, [])

    return(
        <>
          <Navbar carrito={carrito}></Navbar>
          <Outlet context={{productos}} />
        </>
    )
}

export default Layout;