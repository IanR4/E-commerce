import { Link } from 'react-router';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import './Navbar.css';
import {FaShoppingCart} from 'react-icons/fa';
import '../../index.css';
import AccomodationSearchBar from "../accommodationSearchBar/AccomodationSearchBar"; 
import DropdownUtilities from "../dropdown/DropdownUtilities";  
import { useCarritoContext } from '../../store/CarritoContext.jsx'
import Subbar from "./Subbar.jsx";

const Navbar = () => {
  const { carrito } = useCarritoContext();
  const navigate = useNavigate()
  const [cantUnidades, setCantUnidades] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);



  // close user menu when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (showUserMenu && userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [showUserMenu]);

  const irACarrito = () => {
    navigate("/carrito")
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
    <>
    <header className="navbar-bg">
      <nav className="navbar">
        <div className="navbar-section left">
          <DropdownUtilities/>
        </div>

        <div className="navbar-section center-left">
          <div className="brand">
            <Link to={`/`} className="link-no-style">
              <h1 className="brand-text"> Tienda Sol </h1>
              <img id="brand-image" src="images/logosol.jpg" alt="Tienda Sol"/>
            </Link>
          </div>
        </div>

        <div className="navbar-section center">
          <AccomodationSearchBar></AccomodationSearchBar>
        </div>

        <div className="navbar-section right">
          <button className="cart" onClick={irACarrito}>
            <FaShoppingCart color="white"/>
            <span className="cart-count">{cantUnidades}</span>
          </button>
          
        </div>
      </nav>

      
    </header>

    <div className="subheader">
      <Subbar></Subbar>
    </div>
    </>
  );
};

export default Navbar;

