import "./CarritoItem.css";  
import "../../index.css"


const CarritoItem = ({producto, onRemove}) => {
  const handleRemove = () => {
    // Some product objects use `_id` (from backend) while others may use `id`.
    // Ensure we pass the actual identifier to the remover handler.
    const identifier = producto._id ?? producto.id;
    if (typeof onRemove === 'function') onRemove(identifier);
  }

  return (
    <div key={producto._id} className="carrito-card">
      <div className="producto-carrito-card">
        <img
          src={producto.foto}
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