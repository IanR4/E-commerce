import React, { useEffect, useState } from "react";
import "./ProductoTable.css";
import CarouselItem from "../productoItem/CarouselItem";
import Pagination from "../pagination/Pagination";

export default function ProductoTable({ productos, itemsPerPage = 9 }) {

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

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = productos.slice(start, end);

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
            <li className="list-group-item product-cell" key={producto.id}>
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