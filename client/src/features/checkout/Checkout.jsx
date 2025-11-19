import React, { useState } from 'react';
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

  const camposCompletos = Object.values(campos)
    .every(campo => campo && campo.valor && campo.valor.trim() !== '');

  const setValorDe = (campo) => (event) => {
    setCampos(prev => ({
      ...prev,
      [campo]: { ...prev[campo], valor: event.target.value }
    }));
  };

  const totalCarrito = carrito.reduce((sum, producto) => sum + (producto.precio || 0), 0);

  const handleEnviar = () => {
    const pedido = construirPedido();
    postPedido(pedido);
    limpiarCarrito();
    navigate("/")
  };

  const construirPedido = () => {
    return {
      "comprador": "69024e8389d2ba46d57e0c3e",
      "items": carrito.map(producto => ({
        "producto": producto._id,
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
            {carrito.length === 0 ? (
              <Typography color="textSecondary">Tu carrito está vacío</Typography>
            ) : (
              carrito.map((producto, index) => (
                <div key={index} className="producto-item">
                  <div className="producto-info">
                    <Typography variant="body2" className="producto-nombre">
                      {producto.titulo || producto.nombre}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Cantidad: {producto.cantidadUnidades}
                    </Typography>
                  </div>
                  <Typography variant="body2" className="producto-precio">
                    ${convertirMoneda(producto.precio, campos.moneda.valor).toLocaleString("es-AR")}
                  </Typography>
                </div>
              ))
            )}
          </div>
          <div className="resumen-total">
            <Typography variant="h6">Total: ${convertirMoneda(totalCarrito, campos.moneda.valor).toLocaleString("es-AR")}</Typography>
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