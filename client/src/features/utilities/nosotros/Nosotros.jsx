import React from 'react';
import { Card } from '@mui/material';

import './Nosotros.css';

const Nosotros = () => {
	return (
		<div className="nosotros-root">
			<Card className="nosotros-card">
				<h2>Tienda Sol</h2>

				<p className="nosotros-intro">
					En Tienda Sol nos dedicamos a ofrecer productos pensados para hacer la vida
					diaria más sencilla y alegre. Creemos en la calidad, la transparencia y
					en construir relaciones duraderas con nuestros clientes.
				</p>

				<h3>Nuestros valores</h3>

				<div className="valores-list">
					<div className="valor-item">
						<h4>Confianza</h4>
						<p>
							Actuamos con honestidad en cada interacción: información clara sobre
							nuestros productos, procesos de pago seguros y políticas que protegen
							a nuestros clientes.
						</p>
					</div>

					<div className="valor-item">
						<h4>Accesibilidad</h4>
						<p>
							Buscamos que nuestras ofertas y servicios estén al alcance de todas las
							personas: precios competitivos, navegación sencilla y opciones de envío
							pensadas para distintas necesidades.
						</p>
					</div>

					<div className="valor-item">
						<h4>Atención al cliente</h4>
						<p>
							Nuestro equipo está disponible para ayudar: asesoramiento claro,
							tiempos de respuesta responsables y seguimiento hasta que la compra
							llegue en perfectas condiciones.
						</p>
					</div>
				</div>
			</Card>
		</div>
	);
};

export default Nosotros;
