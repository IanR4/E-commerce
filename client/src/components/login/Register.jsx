import React, { useState } from 'react';
import './Register.css';
import { register } from '../../service/usuariosService.js';

export default function Register({ onClose, onRegisterSuccess }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [tipo, setTipo] = useState('Comprador');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!['Comprador', 'Vendedor'].includes(tipo)) {
      setError('Tipo inválido');
      return;
    }
    setLoading(true);
    try {
      const resp = await register(email, password, nombre, tipo, telefono);
      setLoading(false);
      setSuccess('Cuenta creada correctamente');
      if (onRegisterSuccess) onRegisterSuccess(resp?.data ?? resp);
      setTimeout(() => {
        if (onClose) onClose();
      }, 800);
    } catch (err) {
      setLoading(false);
      let message = 'Error al crear la cuenta';
      if (err?.response?.data?.message) message = err.response.data.message;
      else if (err?.response?.status === 400) message = 'Datos inválidos';
      else if (err?.message) message = err.message;
      setError(message);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} tabIndex={0} aria-label="Formulario crear cuenta">
      <p className="form-title">Crear cuenta</p>

      <div className="input-container">
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>

      <div className="input-container">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="input-container">
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="input-container">
        <input
          type="tel"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
      </div>

      <div className="input-container">
        <label className="tipo-label">Tipo de cuenta</label>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="tipo-select">
          <option value="Comprador">Comprador</option>
          <option value="Vendedor">Vendedor</option>
        </select>
      </div>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <button type="submit" className="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear cuenta'}
      </button>

      <p className="signup-link">
        <a href="#" onClick={(e) => { e.preventDefault(); if (onClose) onClose(); }}>Cancelar</a>
      </p>
    </form>
  );
}
