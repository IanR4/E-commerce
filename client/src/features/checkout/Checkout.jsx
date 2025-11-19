import React, { useState, useEffect, useRef } from 'react';
import { Card, TextField, Button, MenuItem, Select, FormControl, InputLabel, Typography, Box } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useCarritoContext } from '../../store/CarritoContext.jsx'
import { postPedido } from '../../service/pedidosService.js';

import './Checkout.css';

const Checkout = () => {
  const { limpiarCarrito, carrito } = useCarritoContext();
  const navigate = useNavigate()

  const inicializarCampo = (requerido = true, valorPorDefecto = '') => ({ valor: valorPorDefecto, requerido });
  const inicializarCampos = () => ({
    moneda: inicializarCampo(true, 'PesoArg'),
    pais: inicializarCampo(),
    provincia: inicializarCampo(),
    ciudad: inicializarCampo(),
    calle: inicializarCampo(),
    altura: inicializarCampo(),
    codigoPostal: inicializarCampo()
  });

  const [campos, setCampos] = useState(inicializarCampos());
  const [user, setUser] = useState(null);

  const camposCompletos = Object.values(campos)
    .every(campo => campo && campo.valor && campo.valor.trim() !== '');

  const setValorDe = (campo) => (event) => {
    setCampos(prev => ({
      ...prev,
      [campo]: { ...prev[campo], valor: event.target.value }
    }));
  };

  const totalCarrito = carrito.reduce((sum, producto) => sum + (producto.precio || 0), 0);

  // Agrupar productos por identificador (`_id` o `id`) y sumar las cantidades
  const productosAgrupadosArray = Object.values(
    (carrito || []).reduce((acc, producto) => {
      const identifier = producto._id ?? producto.id ?? JSON.stringify(producto);
      if (!acc[identifier]) {
        acc[identifier] = {
          ...producto,
          cantidadUnidades: producto.cantidadUnidades ?? 1,
        };
      } else {
        acc[identifier].cantidadUnidades += producto.cantidadUnidades ?? 1;
      }
      return acc;
    }, {})
  );

  const totalCarritoAgrupado = productosAgrupadosArray.reduce(
    (sum, producto) => sum + ((producto.precio || 0) * (producto.cantidadUnidades ?? 1)),
    0
  );

  const handleEnviar = () => {
    const pedido = construirPedido();
    // require user to be logged in
    let usuarioLocal = null
    try {
      const stored = localStorage.getItem('user')
      if (stored) {
        const parsed = JSON.parse(stored)
        const raw = parsed?.raw ?? parsed
        usuarioLocal = raw?._id || raw?.id || null
      }
    } catch (e) {}

    if (!usuarioLocal) {
      // friendly UX: inform user they must log in
      // you can replace with a nicer in-component message if preferred
      window.alert('Pedido fallido')
      return
    }

    // send the pedido and handle result
    postPedido(pedido)
      .then(() => {
        limpiarCarrito();
        navigate("/")
      })
      .catch((err) => {
        console.error('Error al enviar pedido', err)
        const msg = err?.response?.data?.message || err.message || 'Error al procesar el pedido'
        window.alert(msg)
      })
  };

  useEffect(() => {
      try {
        const stored = localStorage.getItem('user');
        if (stored) setUser(JSON.parse(stored));
      } catch (e) {
        // ignore parse errors
      }
    }, []);

    let userId = null
        try {
            const stored = localStorage.getItem('user')
            if (stored) {
                const parsed = JSON.parse(stored)
                const raw = parsed?.raw ?? parsed
                userId = raw?._id
            }
        } catch (err) {
            // ignore parse errors
      }

  const construirPedido = () => {
    return {
      "comprador": userId,
      "items": productosAgrupadosArray.map(producto => ({
        "producto": producto._id ?? producto.id,
        "cantidad": producto.cantidadUnidades,
      })),
      "moneda": campos.moneda.valor,
      "direccionEntrega": campos.pais.valor + ", " + campos.provincia.valor + ", " + campos.ciudad.valor + ", " + campos.calle.valor + " " + campos.altura.valor + ", CP: " + campos.codigoPostal.valor
    }
  }; 

  const convertirMoneda = (monto, moneda) => {
    switch(moneda) {
      case 'PesoArg':
        return monto;
      case 'Real':
        return monto * 0.0038;
      case 'DolarUsa':
        return monto * 0.00071;
    }
    return monto;
  }

  return (
    <div className="checkout-root">
      <div className="checkout-container">
        {/* Columna Izquierda: Resumen del Carrito */}
        <Card className="resumen-column">
          <Typography variant="h6" className="resumen-title">Resumen del Pedido</Typography>
          <div className="productos-lista">
            {productosAgrupadosArray.length === 0 ? (
              <Typography color="textSecondary">Tu carrito está vacío</Typography>
            ) : (
              productosAgrupadosArray.map((producto, index) => (
                <div key={(producto._id ?? producto.id) ?? index} className="producto-item">
                  <div className="producto-info">
                    <Typography variant="body2" className="producto-nombre">
                      {producto.titulo || producto.nombre}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Cantidad: {producto.cantidadUnidades}
                    </Typography>
                  </div>
                  <Typography variant="body2" className="producto-precio">
                    ${convertirMoneda((producto.precio || 0) * (producto.cantidadUnidades ?? 1), campos.moneda.valor).toLocaleString("es-AR")}
                  </Typography>
                </div>
              ))
            )}
          </div> 
          <div className="resumen-total">
            <Typography variant="h6">Total: ${convertirMoneda(totalCarritoAgrupado, campos.moneda.valor).toLocaleString("es-AR")}</Typography>
          </div>
        </Card>

        {/* Columna Derecha: Formulario */}
        <Card className="form-column">
          <Typography variant="h6" className="form-title">Información de Entrega</Typography>
          <form className="form-delivery">
            
            {/* Moneda - Dropdown */}
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Moneda</InputLabel>
              <Select
                value={campos.moneda.valor}
                onChange={setValorDe('moneda')}
                label="Moneda"
              >
                <MenuItem value="PesoArg">Peso Argentino (ARS)</MenuItem>
                <MenuItem value="Real">Real Brasileño (BRL)</MenuItem>
                <MenuItem value="DolarUsa">Dólar Estadounidense (USD)</MenuItem>
              </Select>
            </FormControl>

            {/* País */}
            <TextField
              label="País"
              required
              fullWidth
              margin="normal"
              value={campos.pais.valor}
              onChange={setValorDe('pais')}
            />

            {/* Provincia */}
            <TextField
              label="Provincia"
              required
              fullWidth
              margin="normal"
              value={campos.provincia.valor}
              onChange={setValorDe('provincia')}
            />

            {/* Ciudad */}
            <TextField
              label="Ciudad"
              required
              fullWidth
              margin="normal"
              value={campos.ciudad.valor}
              onChange={setValorDe('ciudad')}
            />

            {/* Calle */}
            <TextField
              label="Calle"
              required
              fullWidth
              margin="normal"
              value={campos.calle.valor}
              onChange={setValorDe('calle')}
            />

            {/* Altura */}
            <TextField
              label="Altura"
              required
              fullWidth
              margin="normal"
              type="number"
              value={campos.altura.valor}
              onChange={setValorDe('altura')}
            />

            {/* Código Postal */}
            <TextField
              label="Código Postal"
              required
              fullWidth
              margin="normal"
              value={campos.codigoPostal.valor}
              onChange={setValorDe('codigoPostal')}
            />

            {/* Botones */}
            <div className="actions">
              <Button 
                variant="outlined" 
                onClick={() => navigate("/carrito")}
              >
                Volver al Carrito
              </Button>
              <Button 
                variant="contained" 
                disabled={!camposCompletos}
                onClick={handleEnviar}
              >
                Enviar Pedido
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;