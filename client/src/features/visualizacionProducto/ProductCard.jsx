import React from 'react'
import axios from 'axios'
import './ProductCard.css'

const ProductCard = ({ producto, onDelete }) => {
  const {
    _id,
    titulo,
    descripcion,
    categorias,
    precio,
    moneda,
    stock,
    foto
  } = producto || {}

  const categoriaTexto = Array.isArray(categorias) ? categorias.join(', ') : (categorias || '')

  const idVal = _id ? (_id.$oid || _id) : (producto?.id || Math.random())
  const idStr = String(idVal)

  

    const handleDelete = async () => {
      const ok = window.confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')
      if (!ok) return
      try {
        const base = process.env.REACT_APP_API_URL || ''
        await axios.delete(`${base}/producto/${idStr}`)
        if (typeof onDelete === 'function') {
          onDelete(idStr)
        } else {
          // fallback: reload to reflect changes
          window.location.reload()
        }
      } catch (err) {
        console.error('Error eliminando producto', err)
        alert('No se pudo eliminar el producto')
      }
    }

    return (
    <div className="producto-card" data-id={idStr}>
      <div className="pv-image-top">
        <img src={foto || '/images/placeholder.png'} alt={titulo} className="pv-image" />
      </div>

      <div className="pedido-header pv-header">
        <div className="pedido-header-left pv-header-left">
          <div>
            <div className="pedido-title pv-title">{titulo}</div>
            <div className="pedido-submeta pv-submeta">
              <span className="pv-category">{categoriaTexto}</span>
              <span className="meta-sep">·</span>
              <span className="pv-price">{precio != null ? `$ ${Number(precio).toLocaleString('es-AR')}` : '—'}</span>
            </div>
          </div>
        </div>
        <button type="button" className="pv-delete-btn" onClick={handleDelete} aria-label="Eliminar producto">Eliminar</button>
      </div>
    </div>
  )
}

export default ProductCard
