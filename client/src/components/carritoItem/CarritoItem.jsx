import "./CarritoItem.css";  
import "../../index.css"


const CarritoItem = ({producto, onRemove}) => {
  const handleRemove = () => {
    // Some product objects use `_id` (from backend) while others may use `id`.
    // Ensure we pass the actual identifier to the remover handler.
    const identifier = producto._id ?? producto.id;
    if (typeof onRemove === 'function') onRemove(identifier);
  }


  const monedaIcons = {
    PesoArg: "$",
    DolarUsa: "US$",
    Real: "R$",
  };

  return (
    <div key={producto._id} className="carrito-card" role="article" aria-label={`Ítem de carrito: ${producto.titulo}`}>
      <div className="producto-carrito-card">
        <img
          src={producto.foto}
          alt={`Imagen de ${producto.titulo}`}
          className="producto-carrito-image"
        />
        <div className="producto-carrito-info">
          <h3 className="producto-name">{producto.titulo}</h3>
          <div className="producto-carrito-details" aria-label="Detalles del producto">
            <h6 className="producto-carrito-cantidad" aria-label={`Cantidad: ${producto.cantidadUnidades}`}>x{producto.cantidadUnidades}</h6>
            <span className="producto-carrito-price" aria-label={`Precio: ${monedaIcons[producto.moneda]}${producto.precio.toLocaleString("es-AR")}`}>{monedaIcons[producto.moneda]}{producto.precio.toLocaleString("es-AR")}</span>
          </div>
          <div className="producto-carrito-eliminar">
            <button
              type="button"
              className="producto-carrito-eliminar-boton"
              onClick={handleRemove}
              aria-label={`Eliminar ${producto.titulo} del carrito`}
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