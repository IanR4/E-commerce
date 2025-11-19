import { useParams } from "react-router-dom";
import { productos } from '../../mockdata/Productos';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ButtonGroup, Button } from '@mui/material';
import "./ProductoDetailPage.css"
import { getProductById } from "../../service/productosService.js"
import {useCarritoContext} from '../../store/CarritoContext.jsx'

const conUnidades = (cantidadUnidades, producto) => ({...producto, cantidadUnidades})
const ProductoDetailPage = () => {
  const { carrito, actualizarCarrito } = useCarritoContext();
  const navigate = useNavigate()
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [seller, setSeller] = useState(() => {
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
  });
  
  const monedaIcons = {
    PesoArg: "$",
    DolarUsa: "US$",
    Real: "R$",
  };

  useEffect(() => {
    const handleUserChanged = () => {
      try {
        const stored = localStorage.getItem('user');
        if (!stored) { setSeller(false); return; }
        const parsed = JSON.parse(stored);
        const raw = parsed?.raw ?? parsed;
        const candidates = [raw?.tipo, raw?.role, raw?.tipoUsuario, raw?.data?.tipo, raw?.data?.role, raw?.data?.tipoUsuario];
        for (const c of candidates) {
          if (typeof c === 'string' && c.toLowerCase().includes('vendedor')) { setSeller(true); return; }
        }
        setSeller(false);
      } catch (e) {
        setSeller(false);
      }
    };
    window.addEventListener('userChanged', handleUserChanged);
    window.addEventListener('storage', handleUserChanged);
    return () => {
      window.removeEventListener('userChanged', handleUserChanged);
      window.removeEventListener('storage', handleUserChanged);
    };
  }, []);

  useEffect(() => {
    const cargarProducto = () => {
      return getProductById(id)
        .then((data) => {
          setProducto(data);
        })
    };
    cargarProducto();
  }, [id]);


  const [unidades, setUnidades] = useState(0);

  useEffect(() => {
    setUnidades(0);
  }, [id, carrito]);
  
  const incrementarUnidades = () => {
    const nuevasUnidades = unidades + 1;
    setUnidades(nuevasUnidades);
  };
  
  const decrementarUnidades = () => {
    if (unidades > 0) {
      const nuevasUnidades = unidades - 1;
      setUnidades(nuevasUnidades);
    }
  };

  const reservar = () => {
    if (carrito.length === 0) {
      actualizarCarrito(conUnidades(unidades, producto));
      navigate(-1);
      return;
    }

    const vendedorCarrito = carrito[0]?.vendedor;
    const vendedorProducto = producto.vendedor;

    if (vendedorCarrito && vendedorProducto && vendedorCarrito === vendedorProducto) {
      actualizarCarrito(conUnidades(unidades, producto));
      navigate(-1);
    } 
    else {
      alert("No se pueden agregar productos de diferentes vendedores al carrito.");
    }
  }

  if (!producto) {
    return (
      <div className="producto-detail-container">
        <div className="producto-header">
          <h1>Producto no encontrado</h1>
          <p>Lo sentimos, no pudimos encontrar el producto que buscas.</p>
        </div>
      </div>
    );
  } 

  return (
    <div className="producto-detail-container">
      <div className="producto-header">
        <h1 className="producto-nombre">{producto.titulo}</h1>
        <div className="producto-stock">Stock: {producto.stock}</div>
      </div>

      <div className="producto-content">
        <div className="producto-image-section">
          <img 
            src={producto.foto} 
            alt={producto.titulo} 
            className="producto-imagen"
          />
        </div>

        <div className="producto-info-section">
          <div className="producto-description">
            {producto.descripcion}
          </div>

          <div className="producto-price-section">
            <div className="producto-precio">{monedaIcons[producto.moneda]}{producto.precio.toLocaleString("es-AR")}</div>
            <div className="price-details">Impuestos incluidos</div>        
          </div>
        </div>
      </div>

      <div className="points-section">
        Con esta compra sumás puntos
      </div>
      
      {!seller && (
        <div className="reservar-container">
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Button onClick={decrementarUnidades} disabled={unidades === 0}>-</Button>
            <Button id="unidadesAComprar" disabled>{unidades}</Button>
            <Button onClick={incrementarUnidades}>+</Button>
          </ButtonGroup>
          {unidades > 0 ? (
            <button className="reservar" onClick={reservar}>Agregar a carrito</button>
          ) : (
            <button className="reservar-bloqueado" disabled>Agregar a carrito</button>
          )}
        </div>
      )}
    </div>
  );
};
export default ProductoDetailPage;

