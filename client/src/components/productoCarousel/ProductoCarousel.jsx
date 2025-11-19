import React, { useState, useEffect} from "react";
import "./ProductoCarousel.css";
import CarouselItem from "../productoItem/CarouselItem";


export default function ProductoCarousel({productos}) {
  useEffect(() => {
    setIndex(0);
  }, [productos]);

  const [index, setIndex] = useState(0);
  const [isVertical, setIsVertical] = useState(false);
  const visible = isVertical ? 1 : 3;
  const productosLimitados = productos.slice(0, 6);

  const siguiente = () => {
    if (index < productosLimitados.length - visible) setIndex(index + 1);
  };

  const anterior = () => {
    if (index > 0) setIndex(index - 1);
  };

  useEffect(() => {
    const checkVertical = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // target small portrait devices: minimum 300x667 -> treat as vertical layout
      setIsVertical(w <= 420 && h <= 700);
    };
    checkVertical();
    window.addEventListener('resize', checkVertical);
    return () => window.removeEventListener('resize', checkVertical);
  }, []);

  if (!Array.isArray(productos) || productos.length === 0) {
    return <p className="carousel-empty">No hay productos disponibles</p>;
  }

  return (
    <div className="carousel-container">
      <h2 className="carousel-title">Productos Trending</h2>

      <div className="carousel-wrapper">
        <div className="carousel-viewport">
          <div className="carousel-track"
          style={isVertical ? {} : {
              transform: `translateX(-${index * (100 / visible)}%)`,
            }}>
            {productosLimitados.map((producto) => (
              <CarouselItem producto={producto} key={producto._id}/> 
            ))}
          </div>
        </div>

        {!isVertical && (
          <>
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
              disabled={index >= productosLimitados.length - visible}
              className={`carousel-btn right-btn ${
                index >= productosLimitados.length - visible ? "disabled" : ""
              }`}
            >
              ▶
            </button>
          </>
        )}
      </div>
    </div>
  );
}