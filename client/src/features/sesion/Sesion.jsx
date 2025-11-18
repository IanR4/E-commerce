import { useState } from "react";
import './Sesion.css';
import { register } from '../../service/usuariosService.js';

const Sesion = () => {
    // use `tipo` state below for user type (Comprador / Vendedor)
    const [email, setEmail] = useState("");
    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState("");
    const [password, setPassword] = useState("");
    const [tipo, setTipo] = useState('Comprador');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [emailTouched, setEmailTouched] = useState(false);
    const [telefonoTouched, setTelefonoTouched] = useState(false);

    const isEmailValid = /^\S+@\S+\.\S+$/.test(email);
    const isTelefonoValid = /^[0-9]{8,}$/.test(telefono);

    const isValid =
        tipo !== "" && 
        nombre.trim() !== "" && 
        password.trim() !== "" &&
        isEmailValid &&
        isTelefonoValid;

     const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
                if (!['Comprador', 'Vendedor'].includes(tipo)) {
          setError('Tipo inválido');
          return;
        }
        setLoading(true);
        try {
                    const resp = await register(email, password, nombre, tipo, telefono);
          setLoading(false);
          setSuccess('Cuenta creada correctamente');
        } catch (err) {
          setLoading(false);
          let message = 'Error al crear la cuenta';
          if (err?.response?.data?.message) message = err.response.data.message;
          else if (err?.response?.status === 400) message = 'Datos inválidos';
          else if (err?.message) message = err.message;
          setError(message);
        }
      };


    return (
        <div className="sesion-container">

            <form className="sesion-form" onSubmit={handleSubmit}>
                <p className="form-title">Crear cuenta</p>
                <div className="input-container">
                    <select
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        className="select-input"
                    >
                        <option value="">Seleccione tipo de usuario</option>
                        <option value="Comprador">Comprador</option>
                        <option value="Vendedor">Vendedor</option>
                    </select>
                </div>
                <div className="input-container">
                    <input 
                        type="email"
                        placeholder="Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setEmailTouched(true)}
                    />
                </div>
                {emailTouched && !isEmailValid && (
                    <p className="error-text">Ingrese un email válido.</p>
                )}

                <div className="input-container">
                    <input 
                        type="text" 
                        placeholder="Nombre"
                        value={nombre} 
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </div>

                <div className="input-container">
                    <input 
                        type="text"
                        placeholder="Telefono"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        onBlur={() => setTelefonoTouched(true)}
                    />
                </div>
                {telefonoTouched && !isTelefonoValid && (
                    <p className="error-text">El teléfono debe tener al menos 8 dígitos.</p>
                )}

                <div className="input-container">
                    <input 
                        type="password" 
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button 
                    type="submit" 
                    className="submit"
                    disabled={!isValid}
                >
                    Crear
                </button>
            </form>
        </div>
    );
}

export default Sesion;

