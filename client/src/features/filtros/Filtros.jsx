import React, { useState } from 'react';
import { Card, TextField, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router';

import { Drawer, List, ListItem, ListItemText, Typography, Divider } from '@mui/material';

import './Filtros.css';

const Filtros = () => {
    const [open, setOpen] = useState(false);
    const inicializarCampo = (requerido = true) => ({ valor: '', requerido });
    const navigate = useNavigate()

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
    <Drawer 
        className="filter-drawer"
        variant="permanent"
        anchor="center"
    >
      <Typography variant="h2" gutterBottom>
        Filtros
      </Typography>
      <Divider />
      <List>
        <ListItem >
          <ListItemText primary="Precio" primaryTypographyProps={{ fontSize: '2rem', fontWeight: 200 }} />
        </ListItem>
        <div className="price-range">
          <input onInput={(e) => {e.target.value = e.target.value.replace(/[^0-9]/g, '');}} 
            type="text" placeholder="Minimo" className="sliderMin" /> 
          -
          <input onInput={(e) => {e.target.value = e.target.value.replace(/[^0-9]/g, '');}} 
            type="text" placeholder="Maximo" className="sliderMax" />
        </div>
        <ListItem>
          <ListItemText primary="Descripcion" primaryTypographyProps={{ fontSize: '2rem', fontWeight: 200 }} />
        </ListItem>
        <input type="text" placeholder="Descripcion del producto" className="descripcion-input" />
        <ListItem>
          <ListItemText primary="Categoria" primaryTypographyProps={{ fontSize: '2rem', fontWeight: 200 }} />
        </ListItem>
    
        <ListItem>
          <ListItemText primary="Vendedor" primaryTypographyProps={{ fontSize: '2rem', fontWeight: 200 }} />
        </ListItem>
      </List>
    </Drawer>
  );
}



export default Filtros;