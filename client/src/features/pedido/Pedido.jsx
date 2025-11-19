import React, { useState, useEffect } from 'react';
import './Pedido.css';
import { getPedidoUsuario, getPedidosVendedor, patchPedido } from '../../service/pedidosService.js';

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

  const [openIds, setOpenIds] = useState(new Set());
  const [editOpenId, setEditOpenId] = useState(null);

  const currentUserId = getStoredUserId();

  const toggleOpen = (id) => {
    setOpenIds(prev => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  const formatCurrency = (n) => {
    try {
      return `$${Number(n).toLocaleString('es-AR')}`;
    } catch (e) {
      return `$${n}`;
    }
  };

  // Allowed transitions according to backend validarTransicion logic
  const estadoTransitions = {
    Pendiente: ['Confirmado', 'Cancelado'],
    Confirmado: ['EnPreparacion', 'Cancelado'],
    EnPreparacion: ['Enviado', 'Cancelado'],
    Enviado: ['Entregado'],
    Entregado: [],
    Cancelado: []
  };

  const getAllowedTargets = (current) => {
    if (!current) return [];
    const list = estadoTransitions[current] || [];
    // exclude same state
    return list.filter(s => s !== current);
  };

  const handleToggleEdit = (id) => {
    setEditOpenId(prev => (prev === id ? null : id));
  };

  const handleChangeEstado = async (pedidoId, targetEstado) => {
    try {
      const usuarioId = getStoredUserId();
      if (!usuarioId) {
        alert('Debe iniciar sesión para actualizar el estado del pedido.');
        return;
      }
      await patchPedido(pedidoId, { estado: targetEstado, usuario: usuarioId });
      // update local copy
      setPedidos(prev => prev.map(p => {
        const pid = p._id ? (p._id.$oid ? p._id.$oid : p._id) : String(p.id || Math.random());
        if (String(pid) === String(pedidoId)) {
          return { ...p, estado: targetEstado };
        }
        return p;
      }));
      setEditOpenId(null);
    } catch (err) {
      console.error('Error actualizando estado:', err);
      // optionally show error to user
      alert('No se pudo actualizar el estado: ' + (err?.response?.data?.message || err.message || ''));
    }
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
          {pedidos.map((pedido) => {
            const idVal = pedido._id ? (pedido._id.$oid || pedido._id) : Math.random();
            const idStr = String(idVal);
            const estadoClass = pedido.estado ? pedido.estado.toLowerCase() : '';
            const isOpen = openIds.has(idStr);

            return (
              <div className={`pedido-card ${estadoClass}`} key={idStr}>
                <div className="pedido-header">
                  <div className="pedido-header-left">
                    <div className="pedido-title">Pedido #{idStr}</div>
                    <div className="pedido-submeta">
                      <span className={`estado ${estadoClass}`}>Estado: {pedido.estado || '—'}</span>
                      <span className="meta-sep">·</span>
                      <span className={`total-inline ${estadoClass}`}>{formatCurrency(calcTotal(pedido.items))}</span>
                    </div>
                  </div>
                  <div className="pedido-actions">
                    <div style={{ position: 'relative' }}>
                      {/* show edit pencil only to vendedor (no mostrar al comprador) */}
                      {pedido.items && currentUserId && pedido.items.some(it => matchesId(it.productoEmbebido?.vendedor, currentUserId)) && (
                        <>
                          <button className="action-icon edit-btn" title="Editar" onClick={() => handleToggleEdit(idStr)}>✎</button>
                          {editOpenId === idStr && (
                            <div className="state-menu">
                              {getAllowedTargets(pedido.estado).length === 0 ? (
                                <div className="state-item disabled">No hay transiciones</div>
                              ) : (
                                getAllowedTargets(pedido.estado).map((s) => (
                                  <button key={s} className="state-item" onClick={() => handleChangeEstado(idStr, s)}>{s}</button>
                                ))
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <button
                      className={`action-icon toggle-btn ${isOpen ? 'open' : ''}`}
                      title="Ver detalles"
                      onClick={() => toggleOpen(idStr)}
                    >▾</button>
                  </div>
                </div>

                {isOpen && (
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
                            <td>{formatCurrency(it.precioUnitario)}</td>
                            <td>{formatCurrency((it.cantidad || 0) * (it.precioUnitario || 0))}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="pedido-footer">
                      <div className="total"><strong>Total:</strong> {formatCurrency(calcTotal(pedido.items))}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Pedido;
