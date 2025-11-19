import React from 'react'
import axios from 'axios'
import './ProductCard.css'
import { patchProduct } from '../../service/productosService.js'

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

    const actualizarStock = () => {
      const nuevoStock = prompt('Ingrese el nuevo stock para el producto:', stock != null ? stock : '0')
      if (nuevoStock !== null) {
        const stockNumber = parseInt(nuevoStock, 10)
        if (!isNaN(stockNumber) && stockNumber >= 0) {
          patchProduct(idStr, { stock: stockNumber })
          window.location.reload(); 
        }
      }
      if (nuevoStock === null) return;
    }

    return (
    <div className="producto-card" data-id={idStr} role="article" aria-label={`Producto: ${titulo}`}>
      <div className="pv-image-top">
        <img src={foto || '/images/placeholder.png'} alt={`Imagen de ${titulo}`} className="pv-image" />
      </div>

      <div className="pedido-header pv-header">
        <div className="pedido-header-left pv-header-left">
          <div>
            <div className="pedido-title pv-title">{titulo}</div>
            <div className="pedido-submeta pv-submeta">
              <span className="pv-category" aria-label={`Categoría: ${categoriaTexto}`}>{categoriaTexto}</span>
              <span className="meta-sep" aria-hidden="true">·</span>
              <span className="pv-price" aria-label={`Precio: $ ${Number(precio).toLocaleString('es-AR')}`}>{precio != null ? `$ ${Number(precio).toLocaleString('es-AR')}` : '—'}</span>
            </div>
            <div className="pedido-submeta-stock">
              <span className="pv-stock" aria-label={`Stock disponible: ${stock != null ? stock : 'No disponible'}`}>Stock: {stock != null ? stock : '—'}</span>
            </div>
          </div>
        </div>
        <div className="botones-product-card">
          <button type="button" className="pv-edit-btn" onClick={actualizarStock} aria-label={`Actualizar stock para ${titulo}`}>Actualizar Stock</button>
          <button type="button" className="pv-delete-btn" onClick={handleDelete} aria-label={`Eliminar producto ${titulo}`}>Eliminar</button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
