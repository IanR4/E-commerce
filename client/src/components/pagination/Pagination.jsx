import React from "react";
import "./Pagination.css";

const Pagination = ({ totalItems, itemsPerPage = 9, currentPage = 1, onPageChange }) => {
	const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

	const gotoPage = (page) => {
		if (page < 1) page = 1;
		if (page > totalPages) page = totalPages;
		if (page !== currentPage && typeof onPageChange === "function") onPageChange(page);
	};

	const pages = [];
	for (let i = 1; i <= totalPages; i++) pages.push(i);

	return (
		<nav aria-label="Paginación de productos" className="pagination-nav">
			<ul className="pagination justify-content-center">
				<li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
					<button className="page-link" onClick={() => gotoPage(currentPage - 1)} aria-label="Anterior">
						Anterior
					</button>
				</li>

				{pages.map((p) => (
					<li key={p} className={`page-item ${p === currentPage ? "active" : ""}`}>
						<button className="page-link" onClick={() => gotoPage(p)}>{p}</button>
					</li>
				))}

				<li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
					<button className="page-link" onClick={() => gotoPage(currentPage + 1)} aria-label="Siguiente">
						Siguiente
					</button>
				</li>
			</ul>
		</nav>
	);
};

export default Pagination;
