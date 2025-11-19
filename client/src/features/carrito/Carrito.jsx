import React, { useState, useEffect } from 'react';
import { Card, TextField, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import CarritoItem from '../../components/carritoItem/CarritoItem.jsx';
import {useCarritoContext} from '../../store/CarritoContext.jsx'

import './Carrito.css';

const Carrito = () => {
  const { removerDelCarrito, limpiarCarrito, carrito } = useCarritoContext();
  const [userId, setUserId] = useState(null)

  const monedaIcons = {
    PesoArg: "$",
    DolarUsa: "US$",
    Real: "R$",
  };

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

  const convertirMoneda = (monto, monedaActual = 'PesoArg', monedaDeseada = 'PesoArg') => {
    // rates expressed as value of 1 ARS in target currency
    const arsTo = {
      PesoArg: 1,
      DolarUsa: 0.00071, // 1 ARS = 0.00071 USD
      Real: 0.0038 // 1 ARS = 0.0038 BRL
    }

    if (!Number.isFinite(monto)) return monto;
    if (monedaActual === monedaDeseada) return monto;

    const fromRate = arsTo[monedaActual] ?? null;
    const toRate = arsTo[monedaDeseada] ?? null;

    // If unknown currency, return original amount
    if (fromRate == null || toRate == null) return monto;

    // Convert amount from `monedaActual` to ARS, then to `monedaDeseada`.
    // amount_in_ars = monto / (1 ARS in monedaActual) = monto / fromRate
    // amount_in_desired = amount_in_ars * (1 ARS in monedaDeseada) = monto * (toRate / fromRate)
    const converted = monto * (toRate / fromRate);
    return converted;
  }

  return (
    <div className="root">
      <Card className="form-container">
        <div role="region" aria-label="Productos en el carrito">
          {productosAgrupadosArray.map((producto, index) => (
            <div key={(producto._id ?? producto.id) ?? index}>
              <CarritoItem producto={producto} onRemove={removerDelCarrito} />
            </div>
          ))}
        </div>

        { productosAgrupadosArray.length !== 0 ? (
          <div className="total">
            {/* Show total converted to Pesos (ARS) while keeping product prices in original currency */}
            <h4 aria-live="polite">
              Total: ${
                (() => {
                  const totalNum = productosAgrupadosArray.reduce((acc, producto) => {
                    const qty = producto.cantidadUnidades ?? 1;
                    const precio = Number(producto.precio) || 0;
                    const monedaProd = producto.moneda || 'PesoArg';
                    const converted = convertirMoneda(precio * qty, monedaProd, 'PesoArg');
                    return acc + (Number.isFinite(converted) ? converted : 0);
                  }, 0);
                  return new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalNum);
                })()
              }
            </h4>
            <br/>
            {!userId && (
              <p className="errorFinalizar" role="alert">
                Debe iniciar sesión para finalizar
              </p>
            )}
            <input
              type="button"
              className="botonFinalizarCompra"
              value="Finalizar compra"
              onClick={() => navigate("/checkout")}
              disabled={!userId}
              aria-label="Ir a finalizar compra"
              style={!userId ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
            />
          </div>
        ) : (
          <div className="carrito-vacio" role="status" aria-live="polite">
            <h4>El carrito está vacío</h4>
            <br/>
            <input type="button" className="botonExplorarProductos" value="Explorar productos!" onClick={() => navigate("/productos?titulo=")} aria-label="Explorar productos disponibles"/>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Carrito;