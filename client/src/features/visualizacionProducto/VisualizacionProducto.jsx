import React, { useEffect, useState } from 'react'
import './VisualizacionProducto.css'
import { getProductVendedor } from '../../service/productosService'
import ProductCard from './ProductCard'

const VisualizacionProducto = () => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let vendedorId = null
    try {
      const stored = localStorage.getItem('user')
      if (stored) {
        const parsed = JSON.parse(stored)
        const raw = parsed?.raw ?? parsed
        vendedorId = raw?._id || raw?.id || null
      }
    } catch (e) {}

    if (!vendedorId) {
      setError('Debes iniciar sesión como vendedor')
      setLoading(false)
      return
    }

    getProductVendedor(vendedorId)
      .then((data) => {
        // assume data.productos or data
        const list = data?.productos || data || []
        setProductos(list)
      })
      .catch((err) => setError(err?.response?.data?.message || err.message || 'Error cargando productos'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="visualizacion-spinner">Cargando productos...</div>
  if (error) return <div className="visualizacion-error">{error}</div>

  return (
    <div className="visualizacion-container">
      <h2 className="visualizacion-title">Mis productos</h2>
      {productos.length === 0 ? (
        <p className="visualizacion-empty">No tenés productos publicados.</p>
      ) : (
        <div className="visualizacion-grid">
          {productos.map((p) => (
            <div key={p._id} className="visualizacion-item">
              <ProductCard producto={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VisualizacionProducto
