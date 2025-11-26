import React, { useEffect, useState } from "react";
import "./ProductoTable.css";
import ProductoItem from "../productoItem/ProductoItem";
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

  const sorted = productos.slice();


  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = sorted.slice(start, end);

  return (
    <div className="product-table">
      <ul className={`list-group product-row`} aria-label={`productos`}> 
        {pageItems.map((producto) => (
          <li className="list-group-item product-cell" key={producto._id || producto.id}>
            <ProductoItem producto={producto} />
          </li>
        ))}
      </ul>

      <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={(p) => setCurrentPage(p)}
      />
    </div>
  );
}