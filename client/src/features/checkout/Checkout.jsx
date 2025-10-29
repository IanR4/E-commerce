import React, { useState } from 'react';
import { Card, TextField, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import CarritoItem from '../../components/carritoItem/CarritoItem.jsx';

import './Checkout.css';

const Checkout = ({ carrito, limpiarCarrito, removerDelCarrito }) => {
  const inicializarCampo = (requerido = true) => ({ valor: '', requerido });
  const navigate = useNavigate()

  const inicializarCampos = () => ({
    nombre: inicializarCampo(),
    segundoNombre: inicializarCampo(false),
    apellido: inicializarCampo(),
    email: inicializarCampo()
  });

  const [campos, setCampos] = useState(inicializarCampos());

  const camposCompletos = Object.values(campos)
    .filter(campo => campo.requerido)
    .every(campo => campo.valor.trim() !== '');

  const setValorDe = (campo) => (event) => {
    setCampos(prev => ({
      ...prev,
      [campo]: { ...prev[campo], valor: event.target.value }
    }));
  };

  const handleGuardar = () => {
    alert('Pedido realizado exitosamente');
    limpiarCarrito();
    navigate("/")
  };

  return (
    <div className="root">
      <Card className="form-container">
        <h3>Ya casi estamos...</h3>
        <div>
          {carrito.map((producto, index) => (
            <div key={producto._id ?? index}>
              <CarritoItem producto={producto} onRemove={removerDelCarrito} />
            </div>
          ))}
        </div>

        <div className="total">
          <h4>Total: ${carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidadUnidades, 0).toLocaleString("es-AR")}</h4>
        </div>

        <form>
          <TextField
            label="Nombre"
            required
            fullWidth
            margin="normal"
            value={campos.nombre.valor}
            onChange={setValorDe('nombre')}
          />
          <TextField
            label="Segundo nombre"
            fullWidth
            margin="normal"
            value={campos.segundoNombre.valor}
            onChange={setValorDe('segundoNombre')}
          />
          <TextField
            label="Apellido"
            required
            fullWidth
            margin="normal"
            value={campos.apellido.valor}
            onChange={setValorDe('apellido')}
          />
          <TextField
            label="Email"
            required
            fullWidth
            margin="normal"
            type="email"
            value={campos.email.valor}
            onChange={setValorDe('email')}
          />
          <div className="actions">
            <Button onClick={() => {}}>Cancelar</Button>
            <Button 
              variant="contained" 
              disabled={!camposCompletos}
              onClick={handleGuardar}
            >
              Guardar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Checkout;