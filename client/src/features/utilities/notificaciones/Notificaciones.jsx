import React, { useState, useRef, useEffect } from "react";
import "./Notificaciones.css";
import { Link } from 'react-router';
import NotificacionDetail from "./NotificacionDetail.jsx";
import { getNotificacionesLeidas } from "../../../service/notificacionesService.js"
import { getNotificacionesNoLeidas } from "../../../service/notificacionesService.js"

const Notificaciones = () => {
  const [notificacionesLeidas, setNotificacionesLeidas] = useState([]);
  const [notificacionesNoLeidas, setNotificacionesNoLeidas] = useState([]);

  const cargarNotificacionesNoLeidas = (vendedorId) => {
    return getNotificacionesNoLeidas(vendedorId)
      .then((notificacionesCargados) => {
        console.log("Notificaciones cargados:", notificacionesCargados);
        setNotificacionesNoLeidas(notificacionesCargados);
      })
      .catch((error) => {
        console.error('Error cargando notificaciones en Layout:', error);
        setNotificacionesNoLeidas([]);
      });
  }
  const cargarNotificacionesLeidas = (vendedorId) => {
    return getNotificacionesLeidas(vendedorId)
      .then((notificacionesCargados) => {
        console.log("Notificaciones cargados:", notificacionesCargados);
        setNotificacionesLeidas(notificacionesCargados);
      })
      .catch((error) => {
        console.error('Error cargando notificaciones en Layout:', error);
        setNotificacionesLeidas([]);
      });
  }

  
  useEffect(() => {
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
      cargarNotificacionesNoLeidas(vendedorId)
      cargarNotificacionesLeidas(vendedorId)
    }, [])

  return (
    <div className="notificaciones-container">
        <ul className="notificaciones-list">
          {notificacionesNoLeidas.length === 0 ? (
            <li className="no-notificaciones">No hay notificaciones no leidas</li>
          ) : (
            notificacionesNoLeidas.map((notificacion) => (
              <li key={notificacion._id}>
                <NotificacionDetail notificacion={notificacion} />
              </li>
            ))
          )}
        </ul>
        <ul className="notificaciones-list">
          {notificacionesLeidas.length === 0 ? (
            <li className="no-notificaciones">No hay notificaciones leidas</li>
          ) : (
            notificacionesLeidas.map((notificacion) => (
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