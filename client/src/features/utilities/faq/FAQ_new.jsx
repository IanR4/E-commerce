import React, { useState } from 'react';
import { Card } from '@mui/material';

import './FAQ.css';

const FAQ = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqs = [
    {
      pregunta: "¿Cómo realizo una compra?",
      respuesta: "Solo tenés que agregar los productos que te interesen al carrito, hacer clic en 'Finalizar compra' y seguir los pasos para completar tus datos y el pago."
    },
    {
      pregunta: "¿Qué métodos de pago aceptan?",
      respuesta: "Aceptamos tarjetas de crédito, débito, transferencias bancarias y pagos a través de plataformas como Mercado Pago."
    },
    {
      pregunta: "¿Hacen envíos a todo el país?",
      respuesta: "Sí, realizamos envíos a todo el territorio nacional. El costo y tiempo de entrega dependen de tu ubicación."
    },
    {
      pregunta: "¿Cuánto tarda en llegar mi pedido?",
      respuesta: "Los envíos suelen demorar entre 2 y 7 días hábiles, dependiendo de la provincia y del método de envío elegido."
    },
    {
      pregunta: "¿Puedo retirar mi compra en persona?",
      respuesta: "Sí, si estás cerca de nuestro local o punto de retiro, podés elegir la opción 'Retiro en persona' al finalizar la compra."
    },
    {
      pregunta: "¿Cómo puedo hacer el seguimiento de mi pedido?",
      respuesta: "Te enviaremos un correo con el número de seguimiento una vez que tu pedido haya sido despachado."
    },
    {
      pregunta: "¿Qué pasa si el producto llega dañado o defectuoso?",
      respuesta: "No te preocupes, podés contactarnos dentro de los 7 días posteriores a la entrega y te ofreceremos un cambio o devolución."
    },
    {
      pregunta: "¿Puedo cancelar mi compra?",
      respuesta: "Sí, podés cancelarla antes de que sea despachada. Si ya fue enviada, tendrás que esperar a recibirla y luego solicitar una devolución."
    },
    {
      pregunta: "¿Tienen garantía los productos?",
      respuesta: "Sí, todos nuestros productos cuentan con garantía oficial del fabricante. El tiempo depende de cada marca."
    },
    {
      pregunta: "¿Cómo puedo comunicarme con atención al cliente?",
      respuesta: "Podés escribirnos por WhatsApp, correo electrónico, o completar el formulario en la sección 'Contacto' de la página."
    }
  ];

  return (
    <div className="root">
      <Card className="faq-container">
        <h1>Preguntas Frecuentes</h1>

        <div className="faq-list" role="region" aria-label="Preguntas frecuentes">
          {faqs.map((item, index) => (
            <div key={index} className="faq-item">
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="faq-summary"
                aria-expanded={expandedIndex === index}
                aria-controls={`faq-answer-${index}`}
                aria-label={item.pregunta}
              >
                <span className="faq-text">{item.pregunta}</span>
                <span className="faq-icon" aria-hidden="true">
                  {expandedIndex === index ? "−" : "+"}
                </span>
              </button>
              {expandedIndex === index && (
                <div 
                  id={`faq-answer-${index}`}
                  className="faq-answer"
                  role="region"
                  aria-label={`Respuesta: ${item.pregunta}`}
                >
                  <p>{item.respuesta}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default FAQ;
