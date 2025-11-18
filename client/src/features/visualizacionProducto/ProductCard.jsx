import React from 'react'
import './ProductCard.css'
import { Link } from 'react-router-dom'

const ProductCard = ({ producto }) => {
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

  return (
    <div className="pv-card pv-card-horizontal">
      <div className="pv-image-wrap">
        <img src={foto || '/images/placeholder.png'} alt={titulo} className="pv-image" />
      </div>

      <div className="pv-body pv-body-horizontal">
        <div className="pv-main">
          <h3 className="pv-title">{titulo}</h3>
          <div className="pv-category">{categoriaTexto}</div>
          <p className="pv-desc">{descripcion}</p>
        </div>

        <div className="pv-side">
          <div className="pv-price">{precio != null ? `$ ${precio.toLocaleString()}` : '—'}</div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
