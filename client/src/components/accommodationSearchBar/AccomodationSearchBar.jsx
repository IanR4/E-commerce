import React, { useState } from 'react'
import { useEffect } from "react";
import './AccomodationSearchBar.css';
import { FaSearch } from 'react-icons/fa';
import { Button, TextField } from "@mui/material";
import { Link, useNavigate, useLocation } from 'react-router-dom';

const AccomodationSearchBar = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setSearchText("");
  }, [location.pathname]);

  return (
    <div className="accommodation-search" role="search" aria-label="Buscar productos">
      <div className='search-field'>
        <div className='input-wrapper'>

          <label htmlFor="search-input" className="sr-only">Buscar productos</label>
          <TextField
            id="search-input"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            variant="standard"
            fullWidth
            placeholder="Buscar productos"
            inputProps={{
              onKeyDown: (e) => {
                if (e.key === 'Enter') {
                  navigate(`/productos?titulo=${searchText}`);
                }
              },
              'aria-label': 'Campo de búsqueda de productos'
            }}
          />

          <Link to={`/productos?titulo=${searchText}`} className="link-no-style" aria-label={`Buscar: ${searchText}`}>
            <Button id="boton" variant="outlined" aria-label="Ejecutar búsqueda" type="button">
              <FaSearch className='button-icon' aria-hidden="true" />
            </Button>
          </Link>

        </div>
      </div>
    </div>
  )
}

export default AccomodationSearchBar

