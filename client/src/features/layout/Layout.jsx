import { Outlet } from "react-router";
import Navbar from "../../components/headers/Navbar.jsx";
import { useState, useEffect } from "react";
import { getProductosSlowly } from "../../service/productosService.js";
import { getProducts } from "../../service/productosService.js";
import Footer from "../../components/footer/Footer.jsx";

const Layout = ({carrito}) => {
  const [productos, setProductos] = useState([]);

    const cargarProductos = () => {
      return getProducts()
        .then((productosCargados) => {
          setProductos(productosCargados);
        })
        .catch((error) => {
          console.error('Error cargando productos en Layout:', error);
          setProductos([]);
        });
    }

    // Para que cuando se monte el componente los cargue
    useEffect(() => {
      cargarProductos()
    }, [])

    return(
        <>
          <Navbar carrito={carrito}></Navbar>
          <Outlet context={{productos}} className = "main" />
          <Footer></Footer>
        </>
    )
}

export default Layout;