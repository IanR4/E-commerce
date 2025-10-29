import "./CarouselItem.css";
import { Link } from "react-router-dom";   
import "../../index.css"

const CarouselItem = ({producto}) => {
  return (
    <div key={producto._id} className="carousel-card">
      <div className="producto-card">
        {/* contenido que se anima al hacer hover */}
        <div className="producto-body">
          <img
            src={producto.foto}
            alt={producto.titulo}
            className="producto-image"
          />
          <div className="producto-info">
            <h3 className="producto-name">{producto.titulo}</h3>
            <div className="producto-details">
              <span className="producto-price">
                ${producto.precio.toLocaleString("es-AR")}
              </span>
            </div>
          </div>
        </div>

        {/* botón fuera del bloque animado para que no se mueva al hacer hover */}
        <div className="ver-detalles-container">
          <span className="ver-detalles">
            <Link to={`/productos/${producto._id}`} className="link-no-style">Ver Detalles</Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default CarouselItem
