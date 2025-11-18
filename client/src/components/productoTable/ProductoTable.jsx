import React, { useEffect, useState } from "react";
import "./ProductoTable.css";
import CarouselItem from "../productoItem/CarouselItem";
import Pagination from "../pagination/Pagination";

export default function ProductoTable({ productos, filtradoDropdown, itemsPerPage = 9 }) {

  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1);

  // Calcula paginado de forma segura incluso si productos es null/undefined
  const totalItems = Array.isArray(productos) ? productos.length : 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // clamp currentPage si cambian los productos/totalPages
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  // Early return after hooks
  if (!Array.isArray(productos) || productos.length === 0) {
    return <p className="product-empty">No hay productos disponibles</p>;
  }
  // Apply sorting to the full productos list BEFORE paginating
  const safeNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  const getVentas = (p) => {
    if (!p) return 0;
    if (typeof p.ventas === 'function') return safeNumber(p.ventas());
    if (typeof p.ventasTotal !== 'undefined') return safeNumber(p.ventasTotal);
    if (typeof p.ventasTotal === 'undefined' && typeof p.ventas === 'undefined') {
      if (typeof p.ventasTotales !== 'undefined') return safeNumber(p.ventasTotales);
    }
    return 0;
  }

  const sorted = productos.slice();

  switch(filtradoDropdown) {
    case 'precioAsc':
      sorted.sort((a, b) => safeNumber(a.precio) - safeNumber(b.precio));
      break;
    case 'precioDesc':
      sorted.sort((a, b) => safeNumber(b.precio) - safeNumber(a.precio));
      break;
    case 'masVendidos':
      sorted.sort((a, b) => getVentas(b) - getVentas(a));
      break;
    default:
      break;
  }

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = sorted.slice(start, end);

  // Agrupar pageItems de a 3 para formar filas
  const rows = [];
  for (let i = 0; i < pageItems.length; i += 3) {
    rows.push(pageItems.slice(i, i + 3));
  }

  return (
    <div className="product-table">
      {rows.map((row, rowIndex) => (
        <ul
          className={`list-group product-row`}
          key={`row-${rowIndex}`}
          aria-label={`fila-${rowIndex}`}
        >
          {row.map((producto) => (
            <li className="list-group-item product-cell" key={producto._id || producto.id}>
              <CarouselItem producto={producto} />
            </li>
          ))}
        </ul>
      ))}

      <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={(p) => setCurrentPage(p)}
      />
    </div>
  );
}