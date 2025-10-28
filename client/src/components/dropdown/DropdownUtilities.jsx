import React, { useState, useRef, useEffect } from "react";
import "./DropdownUtilities.css";
import { Link } from 'react-router';

const DropdownUtilities = () => {
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

  const utilidades = [
    "Contacto",
    "Nosotros",
    "Soporte",
    "FAQ",
  ];

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button className="dropdown-btn" onClick={() => setOpen(!open)}>
        ☰
      </button>

      {open && (
        <ul className={`dropdown-menu ${open ? "show" : ""}`}>
          {utilidades.map((uti, i) => (
            <Link to={`/${uti}`} className="link-no-style">
                <li key={i} className="dropdown-item">
                    {uti}
                </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownUtilities;