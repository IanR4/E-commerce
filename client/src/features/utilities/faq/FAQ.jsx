import React, { useState } from 'react';
import { Card, TextField, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";

import './FAQ.css';

const FAQ = () => {
  return (
    <div className="root">
      <Card className="faq-container">
        <h3>Preguntas Frecuentes</h3>

        <div className="faq-item">
          <details>
            <summary>¿Cómo realizo una compra?</summary>
            <p><br/>Solo tenés que agregar los productos que te interesen al carrito, hacer clic en “Finalizar compra” y seguir los pasos para completar tus datos y el pago.</p>
          </details>
        </div>

        <div className="faq-item">
          <details>
            <summary>¿Qué métodos de pago aceptan?</summary>
            <p><br/>Aceptamos tarjetas de crédito, débito, transferencias bancarias y pagos a través de plataformas como Mercado Pago.</p>
          </details>
        </div>

        <div className="faq-item">
          <details>
            <summary>¿Hacen envíos a todo el país?</summary>
            <p><br/>Sí, realizamos envíos a todo el territorio nacional. El costo y tiempo de entrega dependen de tu ubicación.</p>
          </details>
        </div>

        <div className="faq-item">
          <details>
            <summary>¿Cuánto tarda en llegar mi pedido?</summary>
            <p><br/>Los envíos suelen demorar entre 2 y 7 días hábiles, dependiendo de la provincia y del método de envío elegido.</p>
          </details>
        </div>

        <div className="faq-item">
          <details>
            <summary>¿Puedo retirar mi compra en persona?</summary>
            <p><br/>Sí, si estás cerca de nuestro local o punto de retiro, podés elegir la opción “Retiro en persona” al finalizar la compra.</p>
          </details>
        </div>

        <div className="faq-item">
          <details>
            <summary>¿Cómo puedo hacer el seguimiento de mi pedido?</summary>
            <p><br/>Te enviaremos un correo con el número de seguimiento una vez que tu pedido haya sido despachado.</p>
          </details>
        </div>

        <div className="faq-item">
          <details>
            <summary>¿Qué pasa si el producto llega dañado o defectuoso?</summary>
            <p><br/>No te preocupes, podés contactarnos dentro de los 7 días posteriores a la entrega y te ofreceremos un cambio o devolución.</p>
          </details>
        </div>

        <div className="faq-item">
          <details>
            <summary>¿Puedo cancelar mi compra?</summary>
            <p><br/>Sí, podés cancelarla antes de que sea despachada. Si ya fue enviada, tendrás que esperar a recibirla y luego solicitar una devolución.</p>
          </details>
        </div>

        <div className="faq-item">
          <details>
            <summary>¿Tienen garantía los productos?</summary>
            <p><br/>Sí, todos nuestros productos cuentan con garantía oficial del fabricante. El tiempo depende de cada marca.</p>
          </details>
        </div>

        <div className="faq-item">
          <details>
            <summary>¿Cómo puedo comunicarme con atención al cliente?</summary>
            <p><br/>Podés escribirnos por WhatsApp, correo electrónico, o completar el formulario en la sección “Contacto” de la página.</p>
          </details>
        </div>
      </Card>
    </div>
  );
};

export default FAQ;