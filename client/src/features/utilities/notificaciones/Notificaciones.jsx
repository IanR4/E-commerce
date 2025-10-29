import React, { useState, useRef, useEffect } from "react";
import "./Notificaciones.css";
import { Link } from 'react-router';
import NotificacionDetail from "./NotificacionDetail.jsx";
import { getNotificacionesNoLeidas } from "../../../service/productosService.js"

const Notificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([]);

  const cargarnotificaciones = async () => {
        try {
          const notificacionesCargados = await getNotificacionesNoLeidas();
          console.log("Notificaciones cargados:", notificacionesCargados);
          setNotificaciones(notificacionesCargados)
        } catch (error) {
          console.error('Error cargando notificaciones en Layout:', error);
          setNotificaciones([]);
        }
      }

  
  useEffect(() => {
      cargarnotificaciones()
    }, [])

  return (
    <div className="dropdown">
        <ul className={`dropdown-menu`}>
          {notificaciones.map((notificacion) => (
            <li key={notificacion.id}>
                <NotificacionDetail notificacion={notificacion} className="link-no-style">
                </NotificacionDetail>
            </li>
          ))}
        </ul>
    </div>
  );
};

export default DropdownCategorias;