import React, { useState, useEffect } from "react";
import "./Notificaciones.css";
import NotificacionDetail from "./NotificacionDetail.jsx";
import { getNotificacionesLeidas, getNotificacionesNoLeidas } from "../../../service/notificacionesService.js";

const Notificaciones = () => {
  const [notificacionesLeidas, setNotificacionesLeidas] = useState([]);
  const [notificacionesNoLeidas, setNotificacionesNoLeidas] = useState([]);

  // 1. Función para cargar NO leídas
  const cargarNotificacionesNoLeidas = (vendedorId) => {
    return getNotificacionesNoLeidas(vendedorId)
      .then((notificacionesCargadas) => {
        setNotificacionesNoLeidas(notificacionesCargadas);
      })
      .catch((error) => {
        console.error("Error cargando notificaciones NO leídas:", error);
        setNotificacionesNoLeidas([]);
      });
  };

  // 2. Función para cargar LEÍDAS
  const cargarNotificacionesLeidas = (vendedorId) => {
    return getNotificacionesLeidas(vendedorId)
      .then((notificacionesCargadas) => {
        setNotificacionesLeidas(notificacionesCargadas);
      })
      .catch((error) => {
        console.error("Error cargando notificaciones leídas:", error);
        setNotificacionesLeidas([]);
      });
  };

  // 3. Función combinada para recargar ambas listas después de marcar una como leída
  const recargarNotificaciones = async () => {
    let vendedorId = null;

    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        vendedorId = parsed?.raw?._id ?? parsed?._id;
      }
    } catch (err) {
      console.error("Error leyendo usuario del localStorage");
    }

    await cargarNotificacionesNoLeidas(vendedorId);
    await cargarNotificacionesLeidas(vendedorId);
  };

  // 4. Cargar notificaciones al inicio
  useEffect(() => {
    recargarNotificaciones();
  }, []);

  return (
    <div className="notificaciones-container">

      {/* NOTIFICACIONES NO LEÍDAS */}
      <ul className="notificaciones-list">
        {notificacionesNoLeidas.length === 0 ? (
          <li className="no-notificaciones">No hay notificaciones no leídas</li>
        ) : (
          notificacionesNoLeidas.map((notificacion) => (
            <li key={notificacion._id}>
              <NotificacionDetail 
                notificacion={notificacion}
                onChange={recargarNotificaciones}   // <── callback para refrescar
              />
            </li>
          ))
        )}
      </ul>

      {/* NOTIFICACIONES LEÍDAS */}
      <ul className="notificaciones-list">
        {notificacionesLeidas.length === 0 ? (
          <li className="no-notificaciones">No hay notificaciones leídas</li>
        ) : (
          notificacionesLeidas.map((notificacion) => (
            <li key={notificacion._id}>
              <NotificacionDetail 
                notificacion={notificacion}
                onChange={recargarNotificaciones}   // <── callback para refrescar
              />
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Notificaciones;
