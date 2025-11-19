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
			<ul className="pagination justify-content-center" role="menubar">
				<li className={`page-item ${currentPage === 1 ? "disabled" : ""}`} role="none">
					<button 
						className="page-link" 
						onClick={() => gotoPage(currentPage - 1)} 
						aria-label="Página anterior"
						disabled={currentPage === 1}
						role="menuitem"
					>
						Anterior
					</button>
				</li>

				{pages.map((p) => (
					<li key={p} className={`page-item ${p === currentPage ? "active" : ""}`} role="none">
						<button 
							className="page-link" 
							onClick={() => gotoPage(p)}
							aria-label={`Página ${p}`}
							aria-current={p === currentPage ? "page" : undefined}
							role="menuitem"
						>{p}</button>
					</li>
				))}

				<li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`} role="none">
					<button 
						className="page-link" 
						onClick={() => gotoPage(currentPage + 1)} 
						aria-label="Página siguiente"
						disabled={currentPage === totalPages}
						role="menuitem"
					>
						Siguiente
					</button>
				</li>
			</ul>
		</nav>
	);
};

export default Pagination;
