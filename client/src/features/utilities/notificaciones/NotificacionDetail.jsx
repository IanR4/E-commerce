import React, { useState, useEffect } from 'react';
import "./NotificacionDetail.css"

const NotificacionDetail = ({notificacion}) => {
  return (
    <div key={notificacion.id} className="carousel-card">
      <div className="producto-card">
        {/* contenido que se anima al hacer hover */}
        <div className="producto-body">
          <div className="producto-info">
            <h3 className="producto-name">{notificacion.titulo}</h3>
            <div className="producto-details">
              <span className="producto-price">
                ${notificacion.precio.toLocaleString("es-AR")}
              </span>
            </div>
          </div>
        </div>

        {/* botón fuera del bloque animado para que no se mueva al hacer hover */}
        <div className="ver-detalles-container">
          <span className="ver-detalles">
            <Link to={`/productos/${producto._id}`} className="link-no-style">Ver Detalles</Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default NotificacionDetail