import { createContext, useState, useContext } from "react";

// Crear contexto
const CarritoContext = createContext()

// usar el contexto en un wrapper
export const useCarritoContext = () => useContext(CarritoContext);

export const CarritoProvider = ({ children }) => {
    const [carrito, setCarrito] = useState([]);
    
      const actualizarCarrito = (producto) => {
        setCarrito([...carrito, producto]);
      };
    
      const limpiarCarrito = () => {
        setCarrito([]);
      };
    
      const removerDelCarrito = (id) => {
        // Accept either backend `_id` or frontend `id` as identifier.
        setCarrito(prev => prev.filter(p => String(p._id) !== String(id) && String(p.id) !== String(id)));
      };

    return (
        <CarritoContext.Provider 
            value={
                { 
                    actualizarCarrito, 
                    limpiarCarrito, 
                    removerDelCarrito,
                    carrito
                }
            }
        >
            {children}    
        </CarritoContext.Provider>
    );
}