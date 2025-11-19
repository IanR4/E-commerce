import React, { useState, useRef, useEffect } from "react";
import "./DropdownCategorias.css";
import { Link } from 'react-router';
import { FaThList } from 'react-icons/fa';

const DropdownCategorias = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cierra el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = [
    "Limpieza",
    "Cocina",
    "Vehiculos",
    "Tecnologia",
    "Ropa",
    "Muebles",
    "Ver Todos",
  ];

  return (
    <div className="dropdown-categorias" ref={dropdownRef}>
      <button
        className="dropdown-btn"
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="categorias-menu"
        aria-label="Menú de categorías de productos"
        type="button"
      >
        <FaThList className="subbar-icon" aria-hidden="true" />
        <h3 className="utilities-text"> Categorías ▾ </h3>
      </button>

      {open && (
        <ul id="categorias-menu" className={`dropdown-menu ${open ? "show" : ""}`} role="menu">
          {categories.map((cat, i) => (
            <Link to={`/categoria/${cat}`} className="link-no-style" key={i}>
              <li className="dropdown-item" role="menuitem">
                {cat}
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownCategorias;