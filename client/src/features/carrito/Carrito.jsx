import React, { useState } from 'react';
import { Card, TextField, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import CarritoItem from '../../components/carritoItem/CarritoItem.jsx';
import {useCarritoContext} from '../../store/CarritoContext.jsx'

import './Carrito.css';

const Carrito = () => {
  const { removerDelCarrito, limpiarCarrito, carrito } = useCarritoContext();
  const inicializarCampo = (requerido = true) => ({ valor: '', requerido });
  const navigate = useNavigate()

  return (
    <div className="root">
      <Card className="form-container">
        <div>
          {carrito.map((producto, index) => (
            <div key={producto._id ?? index}>
              <CarritoItem producto={producto} onRemove={removerDelCarrito} />
            </div>
          ))}
        </div>

        { carrito.length !== 0 ? (
          <div className="total">
            <h4>Total: ${carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidadUnidades, 0).toLocaleString("es-AR")}</h4>
            <br/>
            <input type="button" value="Finalizar compra" onClick={() => navigate("/checkout")}/>
          </div>
        ) : (
          <div className="carrito-vacio">
            <h4>El carrito está vacío</h4>
            <br/>
            <input type="button" value="Explorar productos!" onClick={() => navigate("/busqueda/")}/>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Carrito;