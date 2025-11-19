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
const monedaIcons = {
    PesoArg: "$",
    DolarUsa: "US$",
    Real: "R$",
  };

const conUnidades = (unidades, producto) => ({ ...producto, cantidadUnidades: unidades });
const CarouselItem = ({producto}) => {
  const { actualizarCarrito, carrito } = useCarritoContext();
  const navigate = useNavigate()

  const getStockInsuficiente = () => {
    const productoEnCarrito = carrito.find(p => 
      (p._id && p._id === producto._id) || (p.id && p.id === producto.id)
    );
    const cantidadEnCarrito = productoEnCarrito?.cantidadUnidades || 0;
    const cantidadTotal = cantidadEnCarrito + 1;
    return cantidadTotal > producto.stock;
  };

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
    <div key={producto._id} className="carousel-card" role="listitem" aria-label={`Producto: ${producto.titulo}, Precio: ${monedaIcons[producto.moneda]}${producto.precio.toLocaleString("es-AR")}`}>
      <div className="producto-card">
        {/* contenido que se anima al hacer hover */}
        <div className="producto-body">
          <img
            src={producto.foto}
            alt={`Imagen de ${producto.titulo}`}
            className="producto-image"
          />
          <div className="producto-info">
            <h3 className="producto-name">{producto.titulo}</h3>
            <div className="producto-details">
              <span className="producto-price" aria-label={`Precio: ${monedaIcons[producto.moneda]}${producto.precio.toLocaleString("es-AR")}`}>
                {monedaIcons[producto.moneda]}{producto.precio.toLocaleString("es-AR")}
              </span>
            </div>
          </div>
        </div>

        {/* botón fuera del bloque animado para que no se mueva al hacer hover */}
        {!seller && (
          <div className="botones-container">
            <span className="ver-detalles">
              <Link to={`/productos/${producto._id}`} className="link-no-style" aria-label={`Ver detalles de ${producto.titulo}`}>Ver Detalles</Link>
            </span>
            {getStockInsuficiente() ? (
              <button className="comprar-ahora-bloqueado" disabled aria-label="Stock agotado">Stock Agotado</button>
            ) : (
              <button className="comprar-ahora" id="comprarAhora" onClick={reservar} aria-label={`Agregar ${producto.titulo} al carrito`}>Comprar Ahora</button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CarouselItem
