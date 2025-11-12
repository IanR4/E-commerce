import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { List, ListItem, ListItemText, Typography, Divider } from '@mui/material';

import './Filtros.css';

const Filtros = () => {
    const navigate = useNavigate();

    // Estados para los filtros
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [description, setDescription] = useState('');
    const [vendedor, setVendor] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);

    const categories = [
        "Limpieza",
        "Cocina",
        "Vehiculos",
        "Tecnologia",
        "Ropa",
        "Muebles",
    ];

    const toggleCategory = (cat) => {
      setSelectedCategories(prev => {
        if (prev.includes(cat)) return prev.filter(c => c !== cat);
        return [...prev, cat];
      });
    };

    const handleSearch = () => {
      const params = new URLSearchParams();
      if (minPrice !== '') params.set('minPrice', minPrice);
      if (maxPrice !== '') params.set('maxPrice', maxPrice);
      if (description.trim() !== '') params.set('description', description.trim());
      if (vendedor.trim() !== '') params.set('vendor', vendedor.trim());
      if (selectedCategories.length) params.set('categories', selectedCategories.join(','));

      // Navega a la ruta /productos con los filtros en query string
      navigate(`/productos?${params.toString()}`);
    };

  return (
    <>
      <aside className="filter-drawer" aria-label="Filtros de productos">
        <Typography variant="h2" gutterBottom>
          Filtros
        </Typography>
        <Divider />
        <List>
        <ListItem >
          <ListItemText primary="Precio" primaryTypographyProps={{ fontSize: '2rem', fontWeight: 200 }}/>
        </ListItem>
        <div className="price-range">
          <input
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value.replace(/[^0-9]/g, ''))}
            type="text"
            placeholder="Minimo"
            className="sliderMin"
          /> 
          -
          <input
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value.replace(/[^0-9]/g, ''))}
            type="text"
            placeholder="Maximo"
            className="sliderMax"
          />
        </div>
        <ListItem>
          <ListItemText primary="Descripcion" primaryTypographyProps={{ fontSize: '2rem', fontWeight: 200 }} />
        </ListItem>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          type="text"
          placeholder="Descripcion del producto"
          className="descripcion-input"
        />
        <ListItem>
          <ListItemText primary="Categoria" primaryTypographyProps={{ fontSize: '2rem', fontWeight: 200 }} />
        </ListItem>
        <FormGroup>
          {categories.map((cat, i) => (
            <FormControlLabel
              key={i}
              control={
                <Checkbox
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                />
              }
              label={`${cat}`}
            />
          ))}
        </FormGroup>
        <ListItem>
          <ListItemText primary="Vendedor" primaryTypographyProps={{ fontSize: '2rem', fontWeight: 200 }} />
        </ListItem>
        <input
          value={vendedor}
          onChange={(e) => setVendor(e.target.value)}
          type="text"
          placeholder="Nombre del vendedor"
          className="descripcion-input"
        />

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Button variant="contained" id="boton-filtros" onClick={handleSearch}>
            Buscar
          </Button>
        </div>
        </List>
      </aside>
      <div className="filter-spacer" aria-hidden="true" />
    </>
  );
}



export default Filtros;

