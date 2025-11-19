import React, { useEffect, useState } from 'react'
import './VisualizacionProducto.css'
import { getProductVendedor } from '../../service/productosService'
import ProductCard from './ProductCard'
import Pagination from '../../components/pagination/Pagination'

const VisualizacionProducto = () => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 9

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

    const loadPage = (page) => {
      setLoading(true)
      getProductVendedor(vendedorId, page, itemsPerPage)
        .then((data) => {
          // backend returns pagination object: { productos, pagina, entradasPagina, cantidadTotal, totalPaginas }
          const list = data?.productos || data || []
          setProductos(list)
          setTotalItems(data?.cantidadTotal ?? (Array.isArray(list) ? list.length : 0))
          setTotalPages(data?.totalPaginas ?? 1)
        })
        .catch((err) => setError(err?.response?.data?.message || err.message || 'Error cargando productos'))
        .finally(() => setLoading(false))
    }

    loadPage(currentPage)
  }, [])

  if (loading) return <div className="visualizacion-spinner">Cargando productos...</div>
  if (error) return <div className="visualizacion-error">{error}</div>

  return (
    <div className="visualizacion-container">
      <h2 className="visualizacion-title">Mis productos</h2>
      {productos.length === 0 ? (
        <p className="visualizacion-empty">No tenés productos publicados.</p>
      ) : (
        <>
          <div className="visualizacion-grid">
            {productos.map((p) => (
              <div key={p._id} className="visualizacion-item">
                <ProductCard producto={p} onDelete={(id) => {
                  // optimistic UI removal - use updater to avoid stale closure
                  setProductos(prev => {
                    const newArr = prev.filter(x => String(x._id) !== String(id) && String(x.id) !== String(id))
                    if (newArr.length === 0 && currentPage > 1) {
                      setCurrentPage(prevPage => Math.max(1, prevPage - 1))
                    }
                    return newArr
                  })
                }} />
              </div>
            ))}
          </div>

          <Pagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={(p) => {
              setCurrentPage(p)
              // fetch new page
              // retrieve vendedorId again
              let vendedorId = null
              try {
                const stored = localStorage.getItem('user')
                if (stored) {
                  const parsed = JSON.parse(stored)
                  const raw = parsed?.raw ?? parsed
                  vendedorId = raw?._id || raw?.id || null
                }
              } catch (e) {}
              if (vendedorId) getProductVendedor(vendedorId, p, itemsPerPage)
                .then((data) => {
                  const list = data?.productos || data || []
                  setProductos(list)
                  setTotalItems(data?.cantidadTotal ?? (Array.isArray(list) ? list.length : 0))
                  setTotalPages(data?.totalPaginas ?? 1)
                })
                .catch((err) => setError(err?.response?.data?.message || err.message || 'Error cargando productos'))
            }}
          />
        </>
      )}
    </div>
  )
}

export default VisualizacionProducto
