import React, { useState, useRef, useEffect } from "react";
import "./DropdownCategorias.css";
import { Link } from 'react-router';

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
    "Tecnología",
    "Ropa",
    "Muebles",
  ];

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button className="dropdown-btn" onClick={() => setOpen(!open)}>
        Categorías ▾
      </button>

      {open && (
        <ul className={`dropdown-menu ${open ? "show" : ""}`}>
          {categories.map((cat, i) => (
            <Link to={`/categoria/${cat}`} className="link-no-style">
              <li key={i} className="dropdown-item">
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