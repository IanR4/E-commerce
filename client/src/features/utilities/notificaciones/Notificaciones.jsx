import React, { useState, useRef, useEffect } from "react";
import "./Notificaciones.css";
import { Link } from 'react-router';
import NotificacionDetail from "./NotificacionDetail.jsx";
import { getNotificacionesLeidas } from "../../../service/notificacionesService.js"

const Notificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([]);

  const cargarnotificaciones = () => {
    let vendedorId = null
    try {
      const stored = localStorage.getItem('user')
      if (stored) {
        const parsed = JSON.parse(stored)
        const raw = parsed?.raw ?? parsed
        vendedorId = raw?._id
      }
    } catch (err) {
      // ignore parse errors
    }
    return getNotificacionesLeidas(vendedorId)
      .then((notificacionesCargados) => {
        console.log("Notificaciones cargados:", notificacionesCargados);
        setNotificaciones(notificacionesCargados);
      })
      .catch((error) => {
        console.error('Error cargando notificaciones en Layout:', error);
        setNotificaciones([]);
      });
  }

  
  useEffect(() => {
      cargarnotificaciones()
    }, [])

  return (
    <div className="notificaciones-container">
        <ul className="notificaciones-list">
          {notificaciones.length === 0 ? (
            <li className="no-notificaciones">No hay notificaciones</li>
          ) : (
            notificaciones.map((notificacion) => (
              <li key={notificacion._id}>
                <NotificacionDetail notificacion={notificacion} />
              </li>
            ))
          )}
        </ul>
    </div>
  );
};

export default Notificaciones;