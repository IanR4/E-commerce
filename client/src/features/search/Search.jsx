import ProductoCarousel from "../../components/productoCarousel/ProductoCarousel.jsx";
import "./Search.css";
import { useOutletContext } from "react-router";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { getProductosSlowly } from "../../service/productosService.js";
import ProductoTable from "../../components/productoTable/ProductoTable.jsx";
import Filtros from "../filtros/Filtros.jsx";

const Search = () => {
  const outlet = useOutletContext();
  const productos = outlet?.productos || [];
  const { searchText } = useParams();
  const { categoriaName } = useParams();
  const [productosFiltrados, setProductosFiltrados] = useState(null); // null = not loaded yet
  const [loading, setLoading] = useState(false);

  const filtrarProductos = (searchText, categoriaName) => {
    // Normalize inputs to avoid crashes when params are undefined
    const q = (searchText || "").toString();
    const cat = (categoriaName || "").toString();

    if (cat == "Ver Todos") {
      setProductosFiltrados(productos);
      return;
    }

    if (cat.trim() !== "") {
      const filtered = productos.filter((producto) =>
        producto.categorias.some(c => c.toLowerCase().includes(cat.toLowerCase()))
      );
      setProductosFiltrados(filtered);
      return;
    }

    // If search text is empty (or not provided) show all productos
    if (q.trim() === "") {
      setProductosFiltrados(productos);
      return;
    }

    // Otherwise filter by title
    const filtered = productos.filter((producto) =>
      producto.titulo.toLowerCase().includes(q.toLowerCase())
    );
    setProductosFiltrados(filtered);
  };

 

  // Filtrar automáticamente cuando cambia el searchText o los productos
  useEffect(() => {
    // Always attempt to filter when params or productos change.
    // filtrarProductos handles empty/undefined inputs and will show all productos when searchText is empty.
    filtrarProductos(searchText, categoriaName);
  }, [searchText, categoriaName, productos]);

  // Render states: loading spinner, no results, or table
  if (loading || productosFiltrados === null) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '30vh'}}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!productosFiltrados.length) {
    return (
      <div className="busquedaFallida">
        <h1>404: Producto no encontrado</h1>
      </div>
    );
  }
  

  return (
    <div className="ResultadoBusqueda">
      <div>
      <Filtros></Filtros>
      </div>
      <div>
        <ProductoTable productos={productosFiltrados} />
      </div>
    </div>
    
  );
};

export default Search;