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
    "FAQ",
  ];

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        className="dropdown-btn"
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="utilidades-menu"
        aria-label="Menú de utilidades"
        type="button"
      >
        ☰
      </button>

      {open && (
        <ul id="utilidades-menu" className={`dropdown-menu ${open ? "show" : ""}`} role="menu"> 
          {utilidades.map((uti, i) => (
            <Link to={`/${uti}`} className="link-no-style" key={i}>
                <li className="dropdown-item" role="menuitem">
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