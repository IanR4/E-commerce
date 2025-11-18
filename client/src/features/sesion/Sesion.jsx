import { useState } from "react";
import './Sesion.css';

const Sesion = () => {
    const [tipoUsuario, setTipoUsuario] = useState("");
    const [email, setEmail] = useState("");
    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState("");
    const [password, setPassword] = useState("");

    const [emailTouched, setEmailTouched] = useState(false);
    const [telefonoTouched, setTelefonoTouched] = useState(false);

    const isEmailValid = /^\S+@\S+\.\S+$/.test(email);
    const isTelefonoValid = /^[0-9]{8,}$/.test(telefono);

    const isValid =
        tipoUsuario !== "" && 
        nombre.trim() !== "" && 
        password.trim() !== "" &&
        isEmailValid &&
        isTelefonoValid;


    return (
        <div className="sesion-container">

            <form className="sesion-form">
                <p className="form-title">Crear cuenta</p>
                <div className="input-container">
                    <select
                        value={tipoUsuario}
                        onChange={(e) => setTipoUsuario(e.target.value)}
                        className="select-input"
                    >
                        <option value="">Seleccione tipo de usuario</option>
                        <option value="cliente">Cliente</option>
                        <option value="vendedor">Vendedor</option>
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

