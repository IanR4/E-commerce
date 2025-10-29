import React, { useState } from 'react';
import { Card, TextField, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";

import './Contacto.css';

const Contacto = () => {
  const inicializarCampo = (requerido = true) => ({ valor: '', requerido });
  const navigate = useNavigate()

  const inicializarCampos = () => ({
    nombre: inicializarCampo(),
    apellido: inicializarCampo(),
    email: inicializarCampo(),
    mensaje: inicializarCampo()
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

  return (
    <div className="root">
      <Card className="form-container">
        <h3>¡Nos Mantenemos en Contacto!</h3>

        <p>Por favor, completa el siguiente formulario y nos pondremos en contacto contigo a la brevedad.</p>
        <p>Asesoramiento Lunes a Viernes 8 a 18:00, Sábado 8 a 13hrs.</p>

        <p>Telefono: 1170810617</p>

        <p>Membrillar 999</p>

        <p>tiendasol@gmail.com</p>

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
          <TextField
            label="Dejanos un mensaje..."
            required
            fullWidth
            margin="normal"
            type="mensaje"
            value={campos.mensaje.valor}
            onChange={setValorDe('mensaje')}
          />
        </form>
        <div className="actions">
                    
          <Button 
            variant="contained" 
            disabled={!camposCompletos}
          >
            Enviar
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Contacto;