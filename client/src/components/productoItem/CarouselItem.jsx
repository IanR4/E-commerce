import React, { useState, useEffect } from 'react';
import "./CarouselItem.css";
import { Link, useNavigate } from "react-router-dom";   
import "../../index.css"
import {useCarritoContext} from '../../store/CarritoContext.jsx'

const isUserSeller = () => {
  try {
    const stored = localStorage.getItem('user');
    if (!stored) return false;
    const parsed = JSON.parse(stored);
    const raw = parsed?.raw ?? parsed;
    const candidates = [raw?.tipo, raw?.role, raw?.tipoUsuario, raw?.data?.tipo, raw?.data?.role, raw?.data?.tipoUsuario];
    for (const c of candidates) {
      if (typeof c === 'string' && c.toLowerCase().includes('vendedor')) return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

const conUnidades = (unidades, producto) => ({ ...producto, cantidadUnidades: unidades });
const CarouselItem = ({producto}) => {
  const { actualizarCarrito } = useCarritoContext();
  const navigate = useNavigate()

  const reservar = () => {
    actualizarCarrito(conUnidades(1, producto))
    navigate("/carrito")
  }

  const [seller, setSeller] = useState(isUserSeller());

  useEffect(() => {
    const handleUserChanged = () => setSeller(isUserSeller());
    window.addEventListener('userChanged', handleUserChanged);
    window.addEventListener('storage', handleUserChanged);
    return () => {
      window.removeEventListener('userChanged', handleUserChanged);
      window.removeEventListener('storage', handleUserChanged);
    };
  }, []);

  return (
    <div key={producto._id} className="carousel-card">
      <div className="producto-card">
        {/* contenido que se anima al hacer hover */}
        <div className="producto-body">
          <img
            src={producto.foto}
            alt={producto.titulo}
            className="producto-image"
          />
          <div className="producto-info">
            <h3 className="producto-name">{producto.titulo}</h3>
            <div className="producto-details">
              <span className="producto-price">
                ${producto.precio.toLocaleString("es-AR")}
              </span>
            </div>
          </div>
        </div>

        {/* botón fuera del bloque animado para que no se mueva al hacer hover */}
        {!seller && (
          <div className="botones-container">
            <span className="ver-detalles">
              <Link to={`/productos/${producto._id}`} className="link-no-style">Ver Detalles</Link>
            </span>
            <button className="comprar-ahora" id="comprarAhora" onClick={reservar}>Comprar Ahora</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CarouselItem
