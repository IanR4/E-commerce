import "./CarouselItem.css";
import { Link } from "react-router-dom";   
import "../../index.css"

const CarouselItem = ({producto}) => {
  return (
    <div key={producto.id} className="carousel-card">
      <div className="producto-card">
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="producto-image"
        />
        <div className="producto-info">
          <h3 className="producto-name">{producto.nombre}</h3>
          <p className="producto-location">{producto.ubicacion}</p>
          <div className="producto-details">
            <span className="producto-score">{producto.puntaje}</span>
            <span className="producto-price">
              desde: ${producto.precio.toLocaleString("es-AR")} / noche
            </span>
          </div>
          <div className="ver-detalles-container">
            <span className="ver-detalles">
              <Link to={`/productos/${producto.id}`} className="link-no-style">Ver Detalles</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarouselItem
