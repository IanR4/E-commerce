import "./CarouselItem.css";
import { Link, useNavigate } from "react-router-dom";   
import "../../index.css"
import {useCarritoContext} from '../../store/CarritoContext.jsx'

const conUnidades = (unidades, producto) => ({ ...producto, cantidadUnidades: unidades });
const CarouselItem = ({producto}) => {
  const { actualizarCarrito } = useCarritoContext();
  const navigate = useNavigate()

  const reservar = () => {
    actualizarCarrito(conUnidades(1, producto))
    navigate("/carrito")
  }

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
        <div className="botones-container">
          <button className="comprar-ahora" id="comprarAhora" onClick={reservar}>Comprar Ahora</button>
          <span className="ver-detalles">
            <Link to={`/productos/${producto._id}`} className="link-no-style">Ver Detalles</Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default CarouselItem
