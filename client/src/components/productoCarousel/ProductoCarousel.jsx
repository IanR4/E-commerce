import React, { useState, useEffect} from "react";
import "./ProductoCarousel.css";
import CarouselItem from "../productoItem/CarouselItem";


export default function ProductoCarousel({productos}) {
  useEffect(() => {
    setIndex(0);
  }, [productos]);

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(3);
  // vertical layout when only one item is visible (mobile stacked view)
  const isVertical = visible === 1;
  // On small screens we want to show all products stacked; otherwise limit to 6
  const productosLimitados = isVertical ? productos : productos.slice(0, 6);

  const siguiente = () => {
    if (index < productosLimitados.length - visible) setIndex(index + 1);
  };

  const anterior = () => {
    if (index > 0) setIndex(index - 1);
  };

  useEffect(() => {
    const updateVisible = () => {
      const w = window.innerWidth;
      // breakpoints: mobile -> 1, small tablet -> 2, desktop -> 3
      if (w <= 480) setVisible(1);
      else if (w <= 768) setVisible(2);
      else setVisible(3);
      // make sure index stays in range after visible changes
      setIndex((i) => Math.max(0, Math.min(i, Math.max(0, productosLimitados.length - (w <= 480 ? 1 : (w <= 768 ? 2 : 3))))));
    };
    updateVisible();
    window.addEventListener('resize', updateVisible);
    return () => window.removeEventListener('resize', updateVisible);
  }, []);

  if (!Array.isArray(productos) || productos.length === 0) {
    return <p className="carousel-empty">No hay productos disponibles</p>;
  }

  return (
    <div className="carousel-container">
      <h2 className="carousel-title">Productos Trending</h2>

      <div className="carousel-wrapper">
        <div className="carousel-viewport">
          <div
            className={`carousel-track ${isVertical ? 'vertical' : ''}`}
            style={isVertical ? { '--visible': visible } : { transform: `translateX(-${index * (100 / visible)}%)`, '--visible': visible }}
          >
            {productosLimitados.map((producto) => (
              <CarouselItem producto={producto} key={producto._id}/> 
            ))}
          </div>
        </div>

        {!(isVertical) && (
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