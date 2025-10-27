import ProductoCarousel from "../../components/productoCarousel/ProductoCarousel.jsx";
import "./Search.css";
import { useOutletContext } from "react-router";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { getProductosSlowly } from "../../service/productosService.js";
import ProductoTable from "../../components/productoTable/ProductoTable.jsx";

const Search = () => {
  const outlet = useOutletContext();
  const productos = outlet?.productos || [];
  const { searchText } = useParams();
  const [productosFiltrados, setProductosFiltrados] = useState(null); // null = not loaded yet
  const [loading, setLoading] = useState(false);

  const filtrarProductos = (searchText) => {
    if (searchText.trim() === "") {
      setProductosFiltrados(productos);
    } else {
      const filtered = productos.filter((producto) =>
        producto.titulo.toLowerCase().includes(searchText.toLowerCase())
      );
      setProductosFiltrados(filtered);
    }
  };

  const cargarProductos = async () => {
    setLoading(true);
    const productosCargados = await getProductosSlowly();
    // Si hay un searchText en la URL, filtramos sobre los cargados
    if (searchText) {
      const filtered = productosCargados.filter((producto) =>
        producto.titulo.toLowerCase().includes(searchText.toLowerCase())
      );
      setProductosFiltrados(filtered);
    } else {
      setProductosFiltrados(productosCargados);
    }
    setLoading(false);
  };

  // Cargar productos al montar el componente
  useEffect(() => {
    cargarProductos();
  }, []);

  // Filtrar automáticamente cuando cambia el searchText o los productos
  useEffect(() => {
    if(searchText) {
      filtrarProductos(searchText);
    }
  }, [searchText, productos]);

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
        <h1>Producto no encontrado</h1>
      </div>
    );
  }

  return (
    <div>
      <ProductoTable productos={productosFiltrados} />
    </div>
  );
};

export default Search;