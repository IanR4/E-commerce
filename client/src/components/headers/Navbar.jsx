import { Link } from 'react-router';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './Navbar.css';
import {FaShoppingCart} from 'react-icons/fa';
import '../../index.css';
import AccomodationSearchBar from "../accommodationSearchBar/AccomodationSearchBar";
import DropdownCategorias from "../dropdown/DropdownCategorias";  
import DropdownUtilities from "../dropdown/DropdownUtilities";  


const Navbar = ({carrito}) => {
  const navigate = useNavigate()
  const [cantUnidades, setCantUnidades] = useState(0);

  const irAChekout = () => {
    navigate("/checkout")
  }

  const cantUnidadesEnCarrito = () => {
    let suma = 0
    for (const producto of carrito) {
      suma += producto.cantidadUnidades
    }
    return suma;
  }

  useEffect(() => {
    setCantUnidades(cantUnidadesEnCarrito());
  }, [carrito]);

  return (
    <header className="navbar-bg">
      <nav className="navbar">
        <div className="navbar-section left">
          <DropdownUtilities/>
        </div>

        <div className="navbar-section center-left">
          <div className="brand">
            <Link to={`/`} className="link-no-style"><h1 className="brand-text"> Tienda Sol </h1><img id="brand-image" src="images/logosol.jpg"/></Link>
          </div>
        </div>

        <div className="navbar-section center">
          <AccomodationSearchBar></AccomodationSearchBar>
        </div>

        <div className="navbar-section right">
          <button className="cart" onClick={irAChekout}>
            <FaShoppingCart color="white"/>
            <span className="cart-count">{cantUnidades}</span>
          </button>
        </div>
      </nav>
    </header>
    
  );
};

export default Navbar;

{/* <div className="utilities">
            <Link to={`/Notificaciones`} className="link-no-style"><h3 className="utilities-text"> Notificaciones </h3></Link>
            <DropdownCategorias/>
            </div> */}