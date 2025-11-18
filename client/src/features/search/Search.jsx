import ProductoCarousel from "../../components/productoCarousel/ProductoCarousel.jsx";
import "./Search.css";
import { useOutletContext } from "react-router";
import { useParams } from "react-router-dom";
import { getProductosSlowly } from "../../service/productosService.js";
import ProductoTable from "../../components/productoTable/ProductoTable.jsx";
import Filtros from "../filtros/Filtros.jsx";
import { Link, useSearchParams } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import { getProductsFiltered } from "../../service/productosService.js"

const Search = () => {
  const outlet = useOutletContext();
  const productos = outlet?.productos || [];
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { searchText, categoriaName, vendedorId } = useParams();
  const [productosFiltrados, setProductosFiltrados] = useState(null); // null = not loaded yet
  const [loading, setLoading] = useState(false);

  const [filtradoDropdown, setFiltradoDropdown] = useState("");

  const [searchParams] = useSearchParams();

  const categoria = searchParams.get("categoria");
  const titulo = searchParams.get("titulo");
  const descripcion = searchParams.get("descripcion");
  const precioMin = searchParams.get("precioMin");
  const precioMax = searchParams.get("precioMax");
  const vendedor = searchParams.get("vendedor");
  const orden = searchParams.get("orden");

  const dropdown = [
    "Menor Precio",
    "Mayor Precio",
    "Mas Relevantes",
  ];

  const filtros = [
    "precioAsc",
    "precioDesc",
    "masVendidos",
  ];

  const filtrarProductos = (searchText, categoriaName) => {
    // Build filter inputs giving precedence to explicit search params
    const q = (titulo || searchText || "").toString();
    const cat = (categoria || categoriaName || "").toString();
    const desc = (descripcion || "").toString();
    const minP = precioMin ? Number(precioMin) : null;
    const maxP = precioMax ? Number(precioMax) : null;
    const vend = vendedor || null;

    // Start from all productos
    let results = Array.isArray(productos) ? productos.slice() : [];

    // Category filter
    if (cat && cat.trim() !== "") {
      if (cat === "Ver Todos") {
        // keep all
      } else {
        results = results.filter((producto) =>
          Array.isArray(producto.categorias) && producto.categorias.some(c => c.toLowerCase().includes(cat.toLowerCase()))
        );
      }
    }

    // Title / quick search filter
    if (q && q.trim() !== "") {
      results = results.filter((producto) =>
        producto.titulo && producto.titulo.toLowerCase().includes(q.toLowerCase())
      );
    }

    // Description filter
    if (desc && desc.trim() !== "") {
      results = results.filter((producto) =>
        producto.descripcion && producto.descripcion.toLowerCase().includes(desc.toLowerCase())
      );
    }

    // Vendedor filter (works with string or object)
    if (vend && vend.trim() !== "") {
      results = results.filter((producto) => {
        if (!producto.vendedor) return false;
        if (typeof producto.vendedor === 'string') {
          return producto.vendedor.toLowerCase().includes(vend.toLowerCase());
        }
        // try common object shapes
        const nombre = producto.vendedor.nombre || producto.vendedor.username || producto.vendedor.email || '';
        return nombre.toLowerCase().includes(vend.toLowerCase());
      });
    }

    // Price range filter
    if (minP !== null) {
      results = results.filter((producto) => Number(producto.precio) >= minP);
    }
    if (maxP !== null) {
      results = results.filter((producto) => Number(producto.precio) <= maxP);
    }

    setProductosFiltrados(results);
  };

 

  // Filtrar automáticamente cuando cambia el searchText, productos o params
  useEffect(() => {
    // If route contains a vendedorId, request filtered products from backend
    const fetchByVendedor = async () => {
      if (!vendedorId) return false;
      setLoading(true);
      try {
        const productosBackend = await getProductsFiltered(vendedorId, titulo, categoria, descripcion, precioMin, precioMax, orden);
        setProductosFiltrados(Array.isArray(productosBackend) ? productosBackend : []);
      } catch (err) {
        console.error('Error fetching productos por vendedor:', err);
        setProductosFiltrados([]);
      } finally {
        setLoading(false);
      }
      return true;
    };

    // If we fetched by vendedor, skip local filtering
    fetchByVendedor().then(fetched => {
      if (!fetched) {
        filtrarProductos(searchText, categoriaName);
      }
    });
  }, [searchText, categoriaName, productos, searchParams.toString(), vendedorId]);

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
    <>
      <div className="ResultadoBusqueda">
        <div>
        <Filtros></Filtros>
        </div>
        <div>
          <div className="dropdown" ref={dropdownRef}>
            <button className="dropdown-btn" onClick={() => setOpen(!open)}>
              Ordenar por {dropdown[filtros.indexOf(filtradoDropdown)]} ▾
            </button>
            {open && (
                <ul className={`dropdown-menu ${open ? "show" : ""}`}>
                  {dropdown.map((cat, i) => (
                    <button onClick={() => setFiltradoDropdown(filtros[i])} key={i} className="dropdown-item">
                      {cat}
                    </button>
                    /*<Link to={`/productos/${filtros[i]}`} className="link-no-style">
                      <li key={i} className="dropdown-item">
                        {cat}
                      </li>
                    </Link>*/
                  ))}
                </ul>
              )}
          </div>
          <ProductoTable productos={productosFiltrados} filtradoDropdown={filtradoDropdown} />
        </div>
      </div>
    </>
  );
};

export default Search;