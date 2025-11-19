import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useNavigate, useLocation } from "react-router-dom";
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { List, ListItem, ListItemText, Divider } from '@mui/material'
import { getUsuario } from '../../service/usuariosService.js';

import './Filtros.css';


const Filtros = ({ drawer = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

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

    const currentParams = new URLSearchParams(location.search);
    const titulo = currentParams.get('titulo') || '';
    if (titulo) params.set('titulo', titulo);

    if (minPrice !== '') params.set('precioMin', minPrice);
    if (maxPrice !== '') params.set('precioMax', maxPrice);
    if (description.trim() !== '') params.set('descripcion', description.trim());
    if (selectedCategory) params.set('categoria', selectedCategory);

    if (vendedor.trim() !== '') {
      /*
      const match = usuarios.find(u => u.nombre.toLowerCase() === vendedor.trim().toLowerCase());
      if (match) {
        navigate(`/vendedores/${match._id}/productos?${params.toString()}`);
        return;
      }
      */
      getUsuario(vendedor.trim()).then((user) => {
        if (user) {
          navigate(`/vendedores/${user._id}/productos?${params.toString()}`);
          return;
        }
        else {
          alert('Vendedor no encontrado. Verifique el nombre e intente nuevamente.');
          return;
        }
      });
    }

    navigate(`/productos?${params.toString()}`);
  };

  return (
    <>
      <aside className={`filter-drawer ${drawer ? 'drawer-mode' : ''}`} aria-label="Filtros de productos">
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
              placeholder="ID del vendedor"
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

      { !drawer && <div className="filter-spacer" aria-hidden="true" /> }
    </>
  );
};

export default Filtros;
