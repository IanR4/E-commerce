import React from 'react'
import './AccomodationSearchBar.css';
import { FaSearch } from 'react-icons/fa';
import {Button, TextField} from "@mui/material";
import {useState} from "react";
import { Link } from 'react-router-dom';

const AccomodationSearchBar = ({filtrarProductos}) => {
  const [searchText, setSearchText] = useState("");

  return (
    <div className="accommodation-search">
      <div className='search-field'>
        <div className='input-wrapper'>
          <TextField
            value={searchText}
            onChange={(e) => {setSearchText(e.target.value)}}
            fullWidth
            variant="standard"
            placeholder="Buscar productos"
          />
          <Link to={`/busqueda/${searchText}`} className="link-no-style">
          <Button id = "boton" variant="outlined">
            
              <FaSearch className='button-icon' />
            
          </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AccomodationSearchBar

