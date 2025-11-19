import Home from './features/home/Home.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './features/layout/Layout.jsx';
import ProductoDetailPage from './features/productos/ProductoDetailPage.jsx';
import Search from './features/search/Search.jsx';
import {createTheme, ThemeProvider} from "@mui/material"
import Checkout from './features/checkout/Checkout.jsx';
import React, {useState} from "react";
import Contacto from './features/utilities/contacto/Contacto.jsx';
import FAQ from './features/utilities/faq/FAQ.jsx';
import Nosotros from './features/utilities/nosotros/Nosotros.jsx';
import Notificaciones from './features/utilities/notificaciones/Notificaciones.jsx';
import Publicar from './features/publicar/Publicar.jsx';
import VisualizacionProducto from './features/visualizacionProducto/VisualizacionProducto.jsx';
import Pedido from './features/pedido/Pedido.jsx';

const theme = createTheme({
  palette: {
    primary: {
      main: "#24044e"
    }
  }
})

function App() {
  const [carrito, setCarrito] = useState([]);

  const actualizarCarrito = (hotel) => {
    setCarrito([...carrito, hotel]);
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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout  carrito={carrito}/>} >
            <Route index element={<Home />} />
            <Route 
              path="/productos/:id" 
              element={
                <ProductoDetailPage
                  carrito={carrito}
                  actualizarCarrito={actualizarCarrito}
                />
              } 
            />
            <Route 
              path="/checkout" 
              element={
              <Checkout 
                carrito={carrito}
                limpiarCarrito={limpiarCarrito}
                removerDelCarrito={removerDelCarrito}
              />} />
            <Route 
              path="/busqueda/:searchText" 
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
              path="/Publicar" 
              element={
                <Publicar
                />
              } />
              <Route 
              path="/mis-productos"
              element={
                <VisualizacionProducto />
              } />
              <Route 
              path="/mis-pedidos"
              element={
                <Pedido />
              } />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;