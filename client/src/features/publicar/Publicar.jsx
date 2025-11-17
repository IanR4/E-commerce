import React, { useState } from 'react'
import './Publicar.css'
import { postProduct } from '../../service/productosService.js'
import { useNavigate } from 'react-router-dom'

const Publicar = () => {
	const [form, setForm] = useState({
		titulo: '',
		descripcion: '',
		categorias: '',
		precio: '',
		moneda: 'PEN',
		stock: '',
		foto: ''
	})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const [success, setSuccess] = useState(null)
	const navigate = useNavigate()

	const handleChange = (e) => {
		const { name, value } = e.target
		setForm((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError(null)
		setSuccess(null)

		if (!form.titulo || !form.precio) {
			setError('El título y el precio son obligatorios')
			return
		}

		setLoading(true)
		try {
			const categoriasArr = form.categorias
				.split(',')
				.map((c) => c.trim())
				.filter(Boolean)

			const precioNum = parseFloat(form.precio)
			const stockNum = parseInt(form.stock || '0', 10)

			const result = await postProduct(
				form.titulo,
				form.descripcion,
				categoriasArr,
				precioNum,
				form.moneda,
				stockNum,
				form.foto
			)

			setSuccess('Producto creado correctamente')

			// Si la API devuelve el producto con id, redirigir a su página
			const newId = result?.producto?._id || result?.id || result?.producto?.id
			if (newId) {
				navigate(`/producto/${newId}`)
			} else {
				setForm({ titulo: '', descripcion: '', categorias: '', precio: '', moneda: 'PEN', stock: '', foto: '' })
			}
		} catch (err) {
			setError(err?.response?.data?.message || err.message || 'Error al crear el producto')
		} finally {
			setLoading(false)
		}
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

				<label className="publicar-label">Categorías (separadas por coma)</label>
				<input className="publicar-input" name="categorias" value={form.categorias} onChange={handleChange} />

				<div className="publicar-row">
					<div className="publicar-col">
						<label className="publicar-label">Precio</label>
						<input className="publicar-input" name="precio" value={form.precio} onChange={handleChange} />
					</div>
					<div className="publicar-col">
						<label className="publicar-label">Moneda</label>
						<select className="publicar-input" name="moneda" value={form.moneda} onChange={handleChange}>
							<option value="PEN">PEN</option>
							<option value="USD">USD</option>
							<option value="EUR">EUR</option>
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

