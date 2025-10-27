import "./CarritoItem.css";
import { Link } from "react-router-dom";   
import "../../index.css"

const CarritoItem = ({producto, onRemove}) => {
  const handleRemove = () => {
    if (typeof onRemove === 'function') onRemove(producto.id);
  }

  return (
    <div key={producto.id} className="carrito-card">
      <div className="producto-carrito-card">
        <img
          src={producto.imagen}
          alt={producto.titulo}
          className="producto-carrito-image"
        />
        <div className="producto-carrito-info">
          <h3 className="producto-name">{producto.titulo}</h3>
          <div className="producto-carrito-details">
            <h6 className="producto-carrito-cantidad">x{producto.cantidadUnidades}</h6>
            <span className="producto-carrito-price">$ {producto.precio.toLocaleString("es-AR")}</span>
          </div>
          <div className="producto-carrito-eliminar">
            <button
              type="button"
              className="producto-carrito-eliminar-boton"
              onClick={handleRemove}
              aria-label={`Eliminar ${producto.titulo}`}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarritoItem;