import React, { useState, useEffect } from 'react';
import { Card, TextField, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import CarritoItem from '../../components/carritoItem/CarritoItem.jsx';
import {useCarritoContext} from '../../store/CarritoContext.jsx'

import './Carrito.css';

const Carrito = () => {
  const { removerDelCarrito, limpiarCarrito, carrito } = useCarritoContext();
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user')
      if (stored) {
        const parsed = JSON.parse(stored)
        const raw = parsed?.raw ?? parsed
        setUserId(raw?._id || raw?.id || null)
      }
    } catch (e) {
      setUserId(null)
    }
  }, [])
  const inicializarCampo = (requerido = true) => ({ valor: '', requerido });
  const navigate = useNavigate()

  // Agrupar productos por identificador (`_id` o `id`) y sumar las cantidades
  const productosAgrupadosArray = Object.values(
    (carrito || []).reduce((acc, producto) => {
      const identifier = producto._id ?? producto.id ?? JSON.stringify(producto);
      if (!acc[identifier]) {
        // Clonar el producto y asegurar la propiedad `cantidadUnidades`
        acc[identifier] = {
          ...producto,
          cantidadUnidades: producto.cantidadUnidades ?? 1,
        };
        // Normalizar para que la entrada agrupada tenga `_id` cuando exista
        if (!acc[identifier]._id && producto.id) acc[identifier].id = producto.id;
      } else {
        acc[identifier].cantidadUnidades += producto.cantidadUnidades ?? 1;
      }
      return acc;
    }, {})
  );

  return (
    <div className="root">
      <Card className="form-container">
        <div>
          {productosAgrupadosArray.map((producto, index) => (
            <div key={(producto._id ?? producto.id) ?? index}>
              <CarritoItem producto={producto} onRemove={removerDelCarrito} />
            </div>
          ))}
        </div>

        { productosAgrupadosArray.length !== 0 ? (
          <div className="total">
            <h4>Total: ${productosAgrupadosArray.reduce((acc, producto) => acc + (producto.precio * (producto.cantidadUnidades ?? 1)), 0).toLocaleString("es-AR")}</h4>
            <br/>
            {!userId && (
              <p className="errorFinalizar">
                Debe iniciar sesión para finalizar
              </p>
            )}
            <input
              type="button"
              className="botonFinalizarCompra"
              value="Finalizar compra"
              onClick={() => navigate("/checkout")}
              disabled={!userId}
              style={!userId ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
            />
          </div>
        ) : (
          <div className="carrito-vacio">
            <h4>El carrito está vacío</h4>
            <br/>
            <input type="button" className="botonExplorarProductos" value="Explorar productos!" onClick={() => navigate("/productos?titulo=")}/>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Carrito;