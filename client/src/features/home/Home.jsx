import ProductoCarousel from "../../components/productoCarousel/ProductoCarousel";
import {Spinner} from "react-bootstrap";
import React from "react";
import './Home.css';
import { useOutletContext } from 'react-router';


const Home = () => {
  const outlet = useOutletContext();
  const productos = outlet?.productos || [];

    return (
      <>

        {!productos.length ? <div className="spinner">
          <Spinner/>
        </div> :
          <div>
            <ProductoCarousel productos={productos} />
          </div>
        }
      </>
    )
};

export default Home; 