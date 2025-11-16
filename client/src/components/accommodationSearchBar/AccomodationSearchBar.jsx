import React, { useState } from 'react'
import './AccomodationSearchBar.css';
import { FaSearch } from 'react-icons/fa';
import { Button, TextField } from "@mui/material";
import { Link, useNavigate } from 'react-router-dom';

const AccomodationSearchBar = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  return (
    <div className="accommodation-search">
      <div className='search-field'>
        <div className='input-wrapper'>

          <TextField
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            variant="standard"
            fullWidth
            placeholder="Buscar productos"
            inputProps={{
              onKeyDown: (e) => {
                if (e.key === 'Enter') {
                  navigate(`/busqueda/${searchText}`);
                }
              }
            }}
          />

          <Link to={`/busqueda/${searchText}`} className="link-no-style">
            <Button id="boton" variant="outlined">
              <FaSearch className='button-icon' />
            </Button>
          </Link>

        </div>
      </div>
    </div>
  )
}

export default AccomodationSearchBar

