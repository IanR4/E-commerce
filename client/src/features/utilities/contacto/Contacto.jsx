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
        <h1>¡Nos Mantenemos en Contacto!</h1>

        <p>Por favor, completa el siguiente formulario y nos pondremos en contacto contigo a la brevedad.</p>
        <p>Asesoramiento Lunes a Viernes 8 a 18:00, Sábado 8 a 13hrs.</p>

        <div aria-label="Información de contacto">
          <p><span className="sr-only">Teléfono: </span>1170810617</p>
          <p><span className="sr-only">Dirección: </span>Membrillar 999</p>
          <p><span className="sr-only">Email: </span>tiendasol@gmail.com</p>
        </div>

        <form role="form" aria-label="Formulario de contacto">
          <TextField
            id="nombre-input"
            label="Nombre"
            required
            fullWidth
            margin="normal"
            value={campos.nombre.valor}
            onChange={setValorDe('nombre')}
            aria-required="true"
            aria-label="Nombre completo"
          />
          <TextField
            id="apellido-input"
            label="Apellido"
            required
            fullWidth
            margin="normal"
            value={campos.apellido.valor}
            onChange={setValorDe('apellido')}
            aria-required="true"
            aria-label="Apellido"
          />
          <TextField
            id="email-input"
            label="Email"
            required
            fullWidth
            margin="normal"
            type="email"
            value={campos.email.valor}
            onChange={setValorDe('email')}
            aria-required="true"
            aria-label="Correo electrónico"
          />
          <TextField
            id="mensaje-input"
            label="Dejanos un mensaje..."
            required
            fullWidth
            margin="normal"
            multiline
            minRows={4}
            value={campos.mensaje.valor}
            onChange={setValorDe('mensaje')}
            aria-required="true"
            aria-label="Mensaje"
          />
        </form>
        <div className="actions">
                    
          <Button 
            variant="contained" 
            disabled={!camposCompletos}
            aria-label="Enviar formulario de contacto"
          >
            Enviar
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Contacto;