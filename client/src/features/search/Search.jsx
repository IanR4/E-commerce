import ProductoCarousel from "../../components/productoCarousel/ProductoCarousel.jsx";
import "./Search.css";
import { useOutletContext } from "react-router";
import { useParams, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import ProductoTable from "../../components/productoTable/ProductoTable.jsx";
import Filtros from "../filtros/Filtros.jsx";
import React, { useState, useRef, useEffect } from "react";
import { FaFilter } from 'react-icons/fa';
import { getProductsFiltered } from "../../service/productosService.js"

const Search = () => {
  const outlet = useOutletContext();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 900 : false);
  const navigate = useNavigate();
  const location = useLocation();  // <--- Aquí
  const { searchText, categoriaName, vendedorId } = useParams();
  const [productosFiltrados, setProductosFiltrados] = useState(null);
  const [loading, setLoading] = useState(false);

  const [filtradoDropdown, setFiltradoDropdown] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  const categoria = searchParams.get("categoria");
  const titulo = searchParams.get("titulo");
  const descripcion = searchParams.get("descripcion");
  const precioMin = searchParams.get("precioMin");
  const precioMax = searchParams.get("precioMax");
  const vendedor = searchParams.get("vendedor");
  const orden = searchParams.get("orden");

  const [productos, setProductos] = useState([]);
  
  const dropdown = ["Menor Precio", "Mayor Precio", "Mas Relevantes"];
  const filtros = ["precioAsc", "precioDesc", "masVendidos"];

  const filtrarProductos = (searchText, categoriaName, productosBase = null) => {
    const q = (titulo || searchText || "").toString();
    const cat = (categoria || categoriaName || "").toString();
    const desc = (descripcion || "").toString();
    const minP = precioMin ? Number(precioMin) : null;
    const maxP = precioMax ? Number(precioMax) : null;
    const vend = vendedor || null;
    
    let results = Array.isArray(productosBase)
      ? productosBase.slice()
      : (Array.isArray(productos) ? productos.slice() : []);

    if (cat && cat.trim() !== "") {
      if (cat !== "Ver Todos") {
        results = results.filter((producto) =>
          Array.isArray(producto.categorias) && producto.categorias.some(c =>
            c.toLowerCase().includes(cat.toLowerCase())
          )
        );
      }
    }

    if (q && q.trim() !== "") {
      results = results.filter((producto) =>
        producto.titulo?.toLowerCase().includes(q.toLowerCase())
      );
    }

    if (desc && desc.trim() !== "") {
      results = results.filter((producto) =>
        producto.descripcion?.toLowerCase().includes(desc.toLowerCase())
      );
    }

    if (vend && vend.trim() !== "") {
      results = results.filter((producto) => {
        if (!producto.vendedor) return false;
        if (typeof producto.vendedor === "string") {
          return producto.vendedor.toLowerCase().includes(vend.toLowerCase());
        }
        const nombre =
          producto.vendedor.nombre ||
          producto.vendedor.username ||
          producto.vendedor.email ||
          "";
        return nombre.toLowerCase().includes(vend.toLowerCase());
      });
    }

    if (minP !== null) {
      results = results.filter((p) => Number(p.precio) >= minP);
    }
    if (maxP !== null) {
      results = results.filter((p) => Number(p.precio) <= maxP);
    }

    setProductosFiltrados(results);
  };

  const handleOrdenChange = (ordenNuevo) => {
    setFiltradoDropdown(ordenNuevo);
    searchParams.set("orden", ordenNuevo);
    setSearchParams(searchParams);
    navigate(`/productos?${searchParams.toString()}`);
  };

  useEffect(() => {
    const onOpenFilters = () => setFiltersOpen(true);
    const onCloseFilters = () => setFiltersOpen(false);
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('openFilters', onOpenFilters);
    window.addEventListener('closeFilters', onCloseFilters);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('openFilters', onOpenFilters);
      window.removeEventListener('closeFilters', onCloseFilters);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {
        const productosBackend = await getProductsFiltered(
          vendedorId,
          titulo,
          categoria,
          descripcion,
          precioMin,
          precioMax,
          orden
        );
        const lista = Array.isArray(productosBackend) ? productosBackend : [];
        setProductos(lista);
        filtrarProductos(searchText, categoriaName, lista);
      } catch (err) {
        console.error("Error fetching productos:", err);
        setProductos([]);
        filtrarProductos(searchText, categoriaName, []);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [searchText, categoriaName, searchParams.toString(), vendedorId]);

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
          {/* On mobile the filters live in an off-canvas drawer; on desktop they appear inline */}
          {!isMobile && <Filtros />}
        </div>

        <div>
          <div className="dropdown" ref={dropdownRef}>
            <button className="dropdown-btn" onClick={() => setOpen(!open)}>
              Ordenar por {dropdown[filtros.indexOf(filtradoDropdown)]} ▾
            </button>

            {isMobile && (
              <button className="filter-button" title="Filtros" onClick={() => setFiltersOpen(true)} aria-label="Abrir filtros">
                <FaFilter />
              </button>
            )}

            {open && (
              <ul className={`dropdown-menu ${open ? "show" : ""}`}>
                {dropdown.map((cat, i) => (
                  <button
                    onClick={() => handleOrdenChange(filtros[i])}
                    key={i}
                    className="dropdown-item"
                  >
                    {cat}
                  </button>
                ))}
              </ul>
            )}
          </div>

          <ProductoTable productos={productosFiltrados} />
        </div>
        {/* Mobile drawer + overlay for filters */}
        {isMobile && (
          <>
            <div className={`filters-overlay ${filtersOpen ? 'show' : ''}`} onClick={() => setFiltersOpen(false)} />
            <aside className={`filters-drawer ${filtersOpen ? 'open' : ''}`} role="dialog" aria-modal="true">
              <div className="filters-drawer-header">
                <button className="filters-close" onClick={() => setFiltersOpen(false)} aria-label="Cerrar filtros">✕</button>
              </div>
              <div className="filters-drawer-body">
                <Filtros drawer={true} />
              </div>
            </aside>
          </>
        )}
      </div>
    </>
  );
};

export default Search;
