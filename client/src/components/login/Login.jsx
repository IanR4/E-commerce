import { useState } from "react";
import "./Login.css";

export default function Login({ open, onClose }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailTouched, setEmailTouched] = useState(false);
    const isEmailValid = /^\S+@\S+\.\S+$/.test(email);

    if (!open) return null;
    const isValid = isEmailValid && password.trim() !== "";
    return (
        <div className="login-modal-overlay">
            <div className="login-modal-content">

                <button className="login-close-btn" onClick={onClose}>X</button>

                <form className="login-form">
                    <p className="form-title">Ingresá tu cuenta</p>

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
                        Iniciar sesión
                    </button>

                    <p className="login-signup-link">
                        <a href="/Sesion">Crear cuenta</a>
                    </p>
                </form>

            </div>
        </div>
    );
}
