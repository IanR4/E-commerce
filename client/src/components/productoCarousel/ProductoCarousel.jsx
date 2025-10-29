import React, { useState, useEffect} from "react";
import "./ProductoCarousel.css";
import CarouselItem from "../productoItem/CarouselItem";

export default function ProdcutoCarousel({productos}) {

  useEffect(() => {
    setIndex(0);
  }, [productos]);

  const [index, setIndex] = useState(0);
  const visible = 3;

  const siguiente = () => {
    if (index < productos.length - visible) setIndex(index + 1);
  };

  const anterior = () => {
    if (index > 0) setIndex(index - 1);
  };

  if (!Array.isArray(productos) || productos.length === 0) {
    return <p className="carousel-empty">No hay productos disponibles</p>;
  }

  return (
    <div className="carousel-container">
      <h2 className="carousel-title">Productos Trending</h2>

      <div className="carousel-wrapper">
        <div className="carousel-viewport">
          <div className="carousel-track"
          style={{
              transform: `translateX(-${index * (100 / visible)}%)`,
            }}>
            {productos.map((producto) => (
              <CarouselItem producto={producto} key={producto._id}/> 
            ))}
          </div>
        </div>

        <button
          onClick={anterior}
          disabled={index === 0}
          className={`carousel-btn left-btn ${
            index === 0 ? "disabled" : ""
          }`}
        >
          ◀
        </button>

        <button
          onClick={siguiente}
          disabled={index >= productos.length - visible}
          className={`carousel-btn right-btn ${
            index >= productos.length - visible ? "disabled" : ""
          }`}
        >
          ▶
        </button>
      </div>
    </div>
  );
}