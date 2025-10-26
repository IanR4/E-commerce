import { useParams } from "react-router-dom";
import { productos } from '../../mockdata/Productos';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ButtonGroup, Button } from '@mui/material';
import "./ProductoDetailPage.css"

const conUnidades = (cantidadUnidades, producto) => ({...producto, cantidadUnidades})
const ProductoDetailPage = ({ carrito, actualizarCarrito }) => {
  const navigate = useNavigate()
  const { id } = useParams();
  
  // Acá lo busco en el front, pero debería pedirlo en el back
  const producto = productos.find(h => h.id === parseInt(id));


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
    actualizarCarrito(conUnidades(unidades, producto))  
    navigate("/")
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
        <h1 className="producto-nombre">{producto.nombre}</h1>
        <div className="producto-ubicacion">{producto.ubicacion}</div>
      </div>

      <div className="producto-content">
        <div className="producto-image-section">
          <img 
            src={producto.imagen} 
            alt={producto.nombre} 
            className="producto-imagen"
          />
        </div>

        <div className="producto-info-section">
          <div className="producto-description">
            {producto.descripcion}
          </div>

          <div className="producto-price-section">
            <div className="producto-precio">$ {producto.precio?.toLocaleString()}</div>
            <div className="price-details">Impuestos incluidos</div>        
          </div>

          <div className="producto-rating-section">
            <div className="producto-puntaje">{producto.puntaje}</div>
            <div className="rating-text">Excelente</div>
          </div>
        </div>
      </div>

      <div className="points-section">
        Con esta reserva sumás puntos
      </div>
      
      <div className="reservar-container">
        <ButtonGroup variant="outlined" aria-label="outlined button group">
          <Button onClick={decrementarUnidades} disabled={unidades === 0}>-</Button>
          <Button id="unidadesAComprar" disabled>{unidades}</Button>
          <Button onClick={incrementarUnidades}>+</Button>
        </ButtonGroup>
        <button className="reservar" onClick={reservar}>Agregar a carrito</button>
      </div>
    </div>
  );
};
export default ProductoDetailPage;

