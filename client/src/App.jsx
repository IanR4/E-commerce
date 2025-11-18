import Home from './features/home/Home.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './features/layout/Layout.jsx';
import ProductoDetailPage from './features/productos/ProductoDetailPage.jsx';
import Search from './features/search/Search.jsx';
import {createTheme, ThemeProvider} from "@mui/material"
import Carrito from './features/carrito/Carrito.jsx';
import Checkout from './features/checkout/Checkout.jsx';
import React, {useState} from "react";
import Contacto from './features/utilities/contacto/Contacto.jsx';
import FAQ from './features/utilities/faq/FAQ.jsx';
import Nosotros from './features/utilities/nosotros/Nosotros.jsx';
import Notificaciones from './features/utilities/notificaciones/Notificaciones.jsx';
import { CarritoProvider } from './store/CarritoContext.jsx';

const theme = createTheme({
  palette: {
    primary: {
      main: "#24044e"
    }
  }
})

function App() {
  const [carrito, setCarrito] = useState([]);

  const actualizarCarrito = (producto) => {
    setCarrito([...carrito, producto]);
  };

  const limpiarCarrito = () => {
    setCarrito([]);
  };

  const removerDelCarrito = (id) => {
    // Accept either backend `_id` or frontend `id` as identifier.
    setCarrito(prev => prev.filter(p => String(p._id) !== String(id) && String(p.id) !== String(id)));
  };

  return (
    <ThemeProvider theme={theme}>
      <CarritoProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>} >
            <Route index element={<Home/>} />
            <Route 
              path="/productos/:id" 
              element={
                <ProductoDetailPage
                />
              } 
            />
            <Route 
              path="/carrito" 
              element={
              <Carrito 
              />} />
            <Route 
              path="/busqueda/:searchText/" 
              element={
                <Search
                />
              } />
              <Route 
              path="/busqueda/" 
              element={
                <Search
                />
              } />
              <Route 
              path="/categoria/:categoriaName" 
              element={
                <Search
                />
              } />
              <Route
              path="/productos"
              element={
                <Search
                />
              }
              />
              <Route
              path="/vendedores/:vendedorId/productos"
              element={
                <Search
                />
              }
              />
              <Route 
              path="/Contacto" 
              element={
                <Contacto
                />
              } />
              <Route 
              path="/FAQ" 
              element={
                <FAQ
                />
              } />
              <Route 
              path="/Nosotros" 
              element={
                <Nosotros
                />
              } />
              <Route 
              path="/Notificaciones" 
              element={
                <Notificaciones
                />
              } />
              <Route
              path="/checkout"
              element={
                <Checkout
                />
              } />
          </Route>
        </Routes>
      </BrowserRouter>
      </CarritoProvider>
    </ThemeProvider>
  );
}

export default App;