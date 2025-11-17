import React from 'react';
import './Sesion.css';

const Sesion = () => {
    return (
      <div className="modal-content">

          <form className="form">
              <p className="form-title">Crear cuenta</p>

              <div className="input-container">
                  <input type="email" placeholder="Ingresar email" />
              </div>

              <div className="input-container">
                  <input type="password" placeholder="Ingresar contraseña" />
              </div>

              <button type="submit" className="submit">Crear</button>
          </form>
      </div>
    );
}

export default Sesion;

