import React from 'react';
import "./NotificacionDetail.css"
import { leerNotificacion } from "../../../service/notificacionesService.js"

const formatDate = (iso) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString();
  } catch (e) {
    return iso;
  }
}
  

const NotificacionDetail = ({ notificacion = {}, onChange }) => {
  const { _id, usuario, mensaje, leida, fechaLeida, fecha, __v } = notificacion;

  const marcarComoLeida = async () => {
    await leerNotificacion(_id);
    onChange?.();   // <-- actualiza las notificaciones del padre
  };

  return (
    <div className={`notificacion-card ${leida ? 'leida' : 'no-leida'}`} key={_id}>
      <div className="notificacion-card-header">
        <div className="notificacion-meta">
          <span className="notificacion-id">ID: {_id || '—'}</span>
          <span className={`notificacion-leida-badge ${leida ? 'leida-true' : 'leida-false'}`}>
            {leida ? 'Leída' : 'No leída'}
          </span>
        </div>
        <div className="notificacion-fechas">
          <span className="notificacion-fecha">Fecha: {formatDate(fecha)}</span>
          {fechaLeida && <span className="notificacion-fechaLeida">; Fecha lectura: {formatDate(fechaLeida)}</span>}
        </div>
      </div>

      <div className="notificacion-card-body">
        <div className="notificacion-row">
          <strong>Usuario:</strong>
          <span className="notificacion-usuario">{usuario || '—'}</span>
        </div>

        <div className="notificacion-row">
          <strong>Mensaje:</strong>
          <div className="notificacion-mensaje">
            {/* preserva saltos de línea y formato del backend */}
            <pre className="mensaje-pre">{mensaje || ''}</pre>
          </div>
        </div>
        { !leida && (
        <div className={`notificacion-row ${leida ? '' : 'show'}`}>
          <button className="leer" onClick={marcarComoLeida}>Marcar como leida</button>
        </div>
        )}
      </div>
    </div>
  )
}

export default NotificacionDetail