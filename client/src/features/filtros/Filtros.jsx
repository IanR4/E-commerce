import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import { List, ListItem, ListItemText, Divider } from '@mui/material';

import './Filtros.css';
import usuarios from '../../mockdata/usuarios';

const Filtros = () => {
  const navigate = useNavigate();

  // Estados para los filtros
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [description, setDescription] = useState('');
  const [vendedor, setVendor] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');  // SOLO UNA CATEGORÍA

  const categories = [
    "Limpieza",
    "Cocina",
    "Vehiculos",
    "Tecnologia",
    "Ropa",
    "Muebles",
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (minPrice !== '') params.set('precioMin', minPrice);
    if (maxPrice !== '') params.set('precioMax', maxPrice);
    if (description.trim() !== '') params.set('descripcion', description.trim());
    if (selectedCategory) params.set('categoria', selectedCategory); // ← solo una categoría

    // If vendedor provided, attempt to resolve by name to an id in local mockdata
    if (vendedor.trim() !== '') {
      const match = usuarios.find(u => u.nombre.toLowerCase() === vendedor.trim().toLowerCase());
      if (match) {
        // navigate to vendor-specific products route
        navigate(`/busqueda/${match._id}?${params.toString()}`);
        return;
      } else {
        // If no exact match, notify user and abort navigation
        alert('Vendedor no encontrado. Verifique el nombre e intente nuevamente.');
        return;
      }
    }

    navigate(`/productos?${params.toString()}`);
  };

  return (
    <>
      <aside className="filter-drawer" aria-label="Filtros de productos">
        <h2 gutterBottom className="filtros-title">Filtros</h2>
        <Divider />

        <List>

          {/* PRECIO */}
          <div className="filtros-item">
            <ListItem>
              <ListItemText primary="Precio" primaryTypographyProps={{ fontSize: '1.3rem', fontWeight: 200 }} />
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
          </div>

          {/* DESCRIPCIÓN */}
          <div className="filtros-item">
            <ListItem>
              <ListItemText primary="Descripcion" primaryTypographyProps={{ fontSize: '1.3rem', fontWeight: 200 }} />
            </ListItem>

            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              type="text"
              placeholder="Descripcion del producto"
              className="descripcion-input"
            />
          </div>

          {/* CATEGORÍA (RADIO BUTTONS) */}
          <div className="filtros-item">
            <ListItem>
              <ListItemText primary="Categoria" primaryTypographyProps={{ fontSize: '1.3rem', fontWeight: 200 }} />
            </ListItem>

            <RadioGroup
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat, i) => (
                <FormControlLabel
                  key={i}
                  value={cat}
                  control={<Radio />}
                  label={cat}
                />
              ))}
            </RadioGroup>
          </div>

          {/* VENDEDOR */}
          <div className="filtros-item">
            <ListItem>
              <ListItemText primary="Vendedor" primaryTypographyProps={{ fontSize: '1.3rem', fontWeight: 200 }} />
            </ListItem>

            <input
              value={vendedor}
              onChange={(e) => setVendor(e.target.value)}
              type="text"
              placeholder="Nombre del vendedor"
              className="descripcion-input"
            />
          </div>

          {/* BOTÓN BUSCAR */}
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
};

export default Filtros;
