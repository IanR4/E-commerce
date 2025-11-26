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
			<h2 className="publicar-title">Publicar producto</h2>

			<form className="publicar-form" onSubmit={handleSubmit}>
				{error && <div className="publicar-error">{error}</div>}
				{success && <div className="publicar-success">{success}</div>}

				<label className="publicar-label">Título</label>
				<input className="publicar-input" name="titulo" value={form.titulo} onChange={handleChange} />

				<label className="publicar-label">Descripción</label>
				<textarea className="publicar-textarea" name="descripcion" value={form.descripcion} onChange={handleChange} />

				
				<div className="publicar-col">
					<label className="publicar-label">Categoría</label>
					<select className="publicar-input" name="categoria" value={form.categoria} onChange={handleChange}>
						<option value="">Sin Categoria</option>
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
						<label className="publicar-label">Precio</label>
						<input className="publicar-input" name="precio" value={form.precio} onChange={handleChange} />
					</div>
					<div className="publicar-col">
						<label className="publicar-label">Moneda</label>
						<select className="publicar-input" name="moneda" value={form.moneda} onChange={handleChange}>
							<option value="PesoArg">ARS</option>
							<option value="DolarUsa">USD</option>
							<option value="Real">REAL</option>
						</select>
					</div>
					<div className="publicar-col">
						<label className="publicar-label">Stock</label>
						<input className="publicar-input" name="stock" value={form.stock} onChange={handleChange} />
					</div>
				</div>

				<label className="publicar-label">Foto (URL)</label>
				<input className="publicar-input" name="foto" value={form.foto} onChange={handleChange} />

				<button className="publicar-button" type="submit" disabled={loading}>
					{loading ? 'Publicando...' : 'Publicar'}
				</button>
			</form>
		</div>
	)
}

export default Publicar

