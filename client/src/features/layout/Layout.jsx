import { Outlet } from "react-router";
import Navbar from "../../components/headers/Navbar.jsx";
import { useState, useEffect } from "react";
import { getProductosSlowly } from "../../service/productosService.js";

const Layout = ({carrito}) => {
  const [productos, setProductos] = useState([]);

    const cargarProductos = async () => {
      const productosCargados = await getProductosSlowly();
      setProductos(productosCargados)
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