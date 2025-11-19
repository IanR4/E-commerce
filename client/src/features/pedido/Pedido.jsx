import React, { useState, useEffect } from 'react';
import './Pedido.css';
import { getPedidoUsuario, getPedidosVendedor } from '../../service/pedidosService.js';

const Pedido = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getStoredUserId = () => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      const raw = parsed?.raw ?? parsed;
      // possible id shapes
      if (!raw) return null;
      if (typeof raw === 'string') return raw;
      if (raw._id) return (raw._id.$oid ? raw._id.$oid : raw._id);
      if (raw.id) return raw.id;
      if (raw.usuarioId) return raw.usuarioId;
      return null;
    } catch (e) {
      return null;
    }
  };

  const normalizeId = (val) => {
    if (!val && val !== 0) return null;
    if (typeof val === 'string') return val;
    if (val.$oid) return val.$oid;
    return String(val);
  };

  const matchesId = (a, b) => {
    const na = normalizeId(a);
    const nb = normalizeId(b);
    if (!na || !nb) return false;
    return na === nb;
  };

  useEffect(() => {
    const uid = getStoredUserId();
    if (!uid) {
      setPedidos([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    // fetch buyer pedidos and seller pedidos in parallel (seller endpoint added on backend)
    Promise.all([
      getPedidoUsuario(uid).catch((e) => {
        console.warn('Error cargando pedidos de comprador', e);
        return [];
      }),
      getPedidosVendedor(uid).catch((e) => {
        console.warn('Error cargando pedidos de vendedor', e);
        return [];
      })
    ])
    .then(([compradorPedidos, vendedorPedidos]) => {
      const a = Array.isArray(compradorPedidos) ? compradorPedidos : [];
      const b = Array.isArray(vendedorPedidos) ? vendedorPedidos : [];

      // merge and dedupe by pedido id
      const map = new Map();
      const getId = (pedido) => {
        if (!pedido) return null;
        const id = pedido._id ? (pedido._id.$oid ? pedido._id.$oid : pedido._id) : null;
        return id ? String(id) : null;
      };
      [...a, ...b].forEach(p => {
        const id = getId(p);
        if (id && !map.has(id)) map.set(id, p);
      });
      setPedidos(Array.from(map.values()));
    })
      .catch((err) => {
        console.error('Error cargando pedidos:', err);
        setError('No se pudieron cargar los pedidos');
      })
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => {
    if (!d) return '';
    try {
      const dateStr = d.$date ? d.$date : (typeof d === 'string' ? d : d);
      const date = new Date(dateStr);
      return date.toLocaleString();
    } catch (e) {
      return '';
    }
  };

  const calcTotal = (items) => {
    if (!items || items.length === 0) return 0;
    return items.reduce((sum, it) => sum + ((it.cantidad || 0) * (it.precioUnitario || 0)), 0);
  };

  if (loading) return <div className="pedido-container"><p>Cargando pedidos...</p></div>;
  if (error) return <div className="pedido-container"><p className="error">{error}</p></div>;

  return (
    <div className="pedido-container">
      <h2>Mis pedidos</h2>
      {pedidos.length === 0 ? (
        <p>No hay pedidos para mostrar.</p>
      ) : (
        <div className="pedidos-list">
          {pedidos.map((pedido) => (
            <div className="pedido-card" key={pedido._id ? (pedido._id.$oid || pedido._id) : Math.random()}>
              <div className="pedido-header">
                <div>
                  <strong>ID:</strong> {pedido._id ? (pedido._id.$oid || pedido._id) : '—'}
                </div>
                <div>
                  <strong>Fecha:</strong> {formatDate(pedido.fechaCreacion)}
                </div>
                <div>
                  <strong>Estado:</strong> {pedido.estado || '—'}
                </div>
              </div>

              <div className="pedido-body">
                <div className="pedido-meta">
                  <div><strong>Moneda:</strong> {pedido.moneda || '—'}</div>
                  <div><strong>Dirección:</strong> {pedido.direccionEntrega || '—'}</div>
                </div>

                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio unitario</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(pedido.items || []).map((it, idx) => (
                      <tr key={idx}>
                        <td className="item-title">{it.productoEmbebido?.titulo || '—'}</td>
                        <td>{it.cantidad}</td>
                        <td>{it.precioUnitario}</td>
                        <td>{(it.cantidad || 0) * (it.precioUnitario || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="pedido-footer">
                  <div className="total"><strong>Total:</strong> {calcTotal(pedido.items)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Pedido;
