import { Link } from 'react-router';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import './Subbar.css';
import {FaShoppingCart, FaUser, FaBell, FaClipboardList, FaPlusCircle, FaBoxOpen} from 'react-icons/fa';
import '../../index.css';
import AccomodationSearchBar from "../accommodationSearchBar/AccomodationSearchBar";
import DropdownCategorias from "../dropdown/DropdownCategorias";  
import DropdownUtilities from "../dropdown/DropdownUtilities"; 
import Login from "../login/Login";

const Subbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openLogin, setOpenLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  const abrirLogin = () => setOpenLogin(true);
  const cerrarLogin = () => setOpenLogin(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) setUser(JSON.parse(stored));
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    // userData shape may vary; prefer `nombre` (backend) or `name` or email
    const name = userData.nombre;
    const toStore = { displayName: name || 'Usuario', raw: userData };
    setUser(toStore);
    try { localStorage.setItem('user', JSON.stringify(toStore)); } catch (e) {}
    try { window.dispatchEvent(new CustomEvent('userChanged', { detail: toStore })); } catch (e) {}
  }

  const isUserSeller = (u) => {
    if (!u) return false;
    const raw = u.raw ?? u;
    // check multiple possible properties that may contain the role/tipo
    const candidates = [raw?.tipo, raw?.role, raw?.tipoUsuario, raw?.data?.tipo, raw?.data?.role, raw?.data?.tipoUsuario];
    for (const c of candidates) {
      if (typeof c === 'string' && c.toLowerCase().includes('vendedor')) return true;
    }
    return false;
  }

  const handleLogout = () => {
    try { localStorage.removeItem('user'); } catch (e) {}
    setUser(null);
    setShowUserMenu(false);
    navigate('/');
    try { window.dispatchEvent(new CustomEvent('userChanged', { detail: null })); } catch (e) {}
  }

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

  const irAChekout = () => {
    navigate("/checkout")
  }


  return (
    <div className="subbar-bg">
      <nav className="subbar">

        <div className="subbar-section center">
          <DropdownCategorias/>

            {!user && location.pathname !== '/CrearCuenta' && (
              <button className="login-button" onClick={abrirLogin}>
                <FaUser className="subbar-icon" />
                <h3 className="utilities-text"> Iniciar sesión </h3>
              </button>
            )}
            
            {user && (
                <div className="user-dropdown" ref={userMenuRef}>
                  <button className="login-button" onClick={() => setShowUserMenu(s => !s)}>
                    <FaUser className="subbar-icon" />
                    <h3 className="utilities-text">{user.displayName}</h3>
                  </button>
                    {showUserMenu && (
                        <div className="user-menu">
                        <button className="user-menu-item" onClick={handleLogout}>Cerrar sesión</button>
                        </div>
                    )}
                </div>
            )}

            {user && (
              <Link to={`/Notificaciones`} className="publish-button"><FaBell className="subbar-icon" /><h3 className="utilities-text"> Notificaciones </h3></Link>
            )}

            {user && (
              <Link to={`/mis-pedidos`} className="publish-button"><FaClipboardList className="subbar-icon" /><h3 className="utilities-text"> Mis pedidos </h3></Link>
            )}
        
            {user && isUserSeller(user) ? (
                <>
                  <button className="publish-button" onClick={() => navigate('/mis-productos')}><FaBoxOpen className="subbar-icon" /><h3 className="utilities-text"> Mis productos </h3></button>
                </>
            ) : ("")}  
        </div>
         
      </nav>
      <Login open={openLogin} onClose={cerrarLogin} onLoginSuccess={handleLoginSuccess} />
    </div>
  );
};

export default Subbar;
