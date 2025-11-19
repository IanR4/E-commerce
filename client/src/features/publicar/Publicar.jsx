import React, { useState, useRef, useEffect } from "react";
import './Publicar.css'
import { postProduct } from '../../service/productosService.js'
import { useNavigate } from 'react-router-dom'
import { FaThList } from 'react-icons/fa';

const Publicar = () => {
	const [form, setForm] = useState({
		titulo: '',
		descripcion: '',
		categoria: '',
		precio: '',
		moneda: 'PEN',
		stock: '',
		foto: ''
	})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const [success, setSuccess] = useState(null)
	const navigate = useNavigate()
	const [open, setOpen] = useState(false);
	const dropdownRef = useRef(null);

	const handleChange = (e) => {
		const { name, value } = e.target
		setForm((prev) => ({ ...prev, [name]: value }))
	}

	

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleCategoriaClick = (cat) => {
		setForm((prev) => ({ ...prev, categoria: cat }));
		setOpen(false);
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		setError(null)
		setSuccess(null)

		if (!form.titulo || !form.precio) {
			setError('El título y el precio son obligatorios')
			return
		}

		setLoading(true)
		const precioNum = parseFloat(form.precio)
		const stockNum = parseInt(form.stock || '0', 10)

		// obtener id del vendedor desde localStorage (guardado en Subbar como { displayName, raw })
		let vendedorId = null
		try {
			const stored = localStorage.getItem('user')
			if (stored) {
				const parsed = JSON.parse(stored)
				const raw = parsed?.raw ?? parsed
				vendedorId = raw?._id
			}
		} catch (err) {
			// ignore parse errors
		}

		if (!vendedorId) {
			setLoading(false)
			setError('Debes iniciar sesión como vendedor para publicar')
			return
		}

		// asegurar que la URL de la foto comience con /images/
		const fotoPath = form.foto
			? (form.foto.startsWith('/images/') ? form.foto : `/images/${form.foto.replace(/^\/+/, '')}`)
			: ''

		postProduct(
			vendedorId,
			form.titulo,
			form.descripcion,
			form.categoria,
			precioNum,
			form.moneda,
			stockNum,
			fotoPath
		)
			.then((result) => {
				setSuccess('Producto creado correctamente')

				const newId = (result && (result.producto && (result.producto._id || result.producto.id))) || result?.id || null
				if (newId) {
					navigate(`/producto/${newId}`)
				} else {
					setForm({ titulo: '', descripcion: '', categoria: '', precio: '', moneda: 'PEN', stock: '', foto: '' })
				}
			})
			.catch((err) => {
				setError(err?.response?.data?.message || err.message || 'Error al crear el producto')
			})
			.finally(() => {
				setLoading(false)
			})
	}

	return (
		<div className="publicar-container">
			<h1 className="publicar-title">Publicar producto</h1>

			<form className="publicar-form" onSubmit={handleSubmit} role="form" aria-label="Formulario para publicar producto">
				{error && <div className="publicar-error" role="alert" aria-live="assertive">{error}</div>}
				{success && <div className="publicar-success" role="status" aria-live="polite">{success}</div>}

				<div>
					<label htmlFor="titulo-input" className="publicar-label">Título <span aria-label="requerido">*</span></label>
					<input 
						id="titulo-input"
						className="publicar-input" 
						name="titulo" 
						value={form.titulo} 
						onChange={handleChange}
						required
						aria-required="true"
						aria-label="Título del producto"
					/>
				</div>

				<div>
					<label htmlFor="desc-input" className="publicar-label">Descripción</label>
					<textarea 
						id="desc-input"
						className="publicar-textarea" 
						name="descripcion" 
						value={form.descripcion} 
						onChange={handleChange}
						aria-label="Descripción del producto"
					/>
				</div>

				
				<div className="publicar-col">
					<label htmlFor="categoria-input" className="publicar-label">Categoría</label>
					<select 
						id="categoria-input"
						className="publicar-input" 
						name="categoria" 
						value={form.categoria} 
						onChange={handleChange}
						aria-label="Seleccionar categoría del producto"
					>
						<option value="Limpieza">Limpieza</option>
						<option value="Cocina">Cocina</option>
						<option value="Vehiculos">Vehiculos</option>
						<option value="Tecnologia">Tecnologia</option>
						<option value="Ropa">Ropa</option>
						<option value="Muebles">Muebles</option>
					</select>
				</div>
				
				<div className="publicar-row">
					<div className="publicar-col">
						<label htmlFor="precio-input" className="publicar-label">Precio <span aria-label="requerido">*</span></label>
						<input 
							id="precio-input"
							className="publicar-input" 
							name="precio" 
							value={form.precio} 
							onChange={handleChange}
							required
							aria-required="true"
							type="number"
							step="0.01"
							aria-label="Precio del producto"
						/>
					</div>
					<div className="publicar-col">
						<label htmlFor="moneda-input" className="publicar-label">Moneda</label>
						<select 
							id="moneda-input"
							className="publicar-input" 
							name="moneda" 
							value={form.moneda} 
							onChange={handleChange}
							aria-label="Seleccionar moneda"
						>
							<option value="PesoArg">ARS</option>
							<option value="DolarUsa">USD</option>
							<option value="Real">REAL</option>
						</select>
					</div>
					<div className="publicar-col">
						<label htmlFor="stock-input" className="publicar-label">Stock</label>
						<input 
							id="stock-input"
							className="publicar-input" 
							name="stock" 
							value={form.stock} 
							onChange={handleChange}
							type="number"
							min="0"
							aria-label="Cantidad de stock disponible"
						/>
					</div>
				</div>

				<div>
					<label htmlFor="foto-input" className="publicar-label">Foto (URL)</label>
					<input 
						id="foto-input"
						className="publicar-input" 
						name="foto" 
						value={form.foto} 
						onChange={handleChange}
						type="url"
						aria-label="URL de la imagen del producto"
					/>
				</div>

				<button 
					className="publicar-button" 
					type="submit" 
					disabled={loading}
					aria-busy={loading}
					aria-label={loading ? "Publicando..." : "Publicar producto"}
				>
					{loading ? 'Publicando...' : 'Publicar'}
				</button>
			</form>
		</div>
	)
}

export default Publicar

