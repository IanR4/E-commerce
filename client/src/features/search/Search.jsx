import ProductoCarousel from "../../components/productoCarousel/ProductoCarousel.jsx";
import "./Search.css";
import { useOutletContext } from "react-router";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { getProductosSlowly } from "../../service/productosService.js";

const Search = () => {
  const outlet = useOutletContext();
  const productos = outlet?.productos || [];
  const { searchText } = useParams();
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  const filtrarProductos = (searchText) => {
    if (searchText.trim() === "") {
      setProductosFiltrados(productos);
    } else {
      const filtered = productos.filter((producto) =>
        producto.ubicacion.toLowerCase().includes(searchText.toLowerCase())
      );
      setProductosFiltrados(filtered);
    }
  };

  const cargarProductos = async () => {
    const productosCargados = await getProductosSlowly();
    // Si hay un searchText en la URL, filtramos sobre los cargados
    if (searchText) {
      const filtered = productosCargados.filter((producto) =>
        producto.ubicacion.toLowerCase().includes(searchText.toLowerCase())
      );
      setProductosFiltrados(filtered);
    } else {
      setProductosFiltrados(productosCargados);
    }
  };

  // Cargar productos al montar el componente
  useEffect(() => {
    cargarProductos();
  }, []);

  // Filtrar automáticamente cuando cambia el searchText o los productos
  useEffect(() => {
    filtrarProductos(searchText);
  }, [searchText, productos]);

  return (
    <>
      {!productosFiltrados.length ? (
        <div className="busquedaFallida">
          <h1>Producto no encontrado</h1>
        </div>
      ) : (
        <div>
          <ProductoCarousel productos={productosFiltrados} />
        </div>
      )}
    </>
  );
};

export default Search;