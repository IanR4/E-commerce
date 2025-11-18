import ProductoCarousel from "../../components/productoCarousel/ProductoCarousel";
import {Spinner} from "react-bootstrap";
import React from "react";
import './Home.css';
import { useOutletContext } from 'react-router';
import { useState, useEffect } from "react";
import { getProductsFiltered } from "../../service/productosService.js";  


const Home = () => {
  const outlet = useOutletContext();
  const [productos, setProductos] = useState([]);

  const cargarProductos = () => {
    return getProductsFiltered()
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

    return (
      <>
        <div className="banner">
          <img className="home-banner" src="/images/bannerhome.jpg" alt="Banner Principal"/>
        </div>
        {!productos.length ? <div className="spinner">
          <Spinner/>
        </div> :
          <div>
            <ProductoCarousel productos={productos}/>
          </div>
        }
      </>
    )
};

export default Home; 