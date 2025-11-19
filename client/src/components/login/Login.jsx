import React, { useState } from "react";
import "./Login.css";
import { login } from "../../service/usuariosService.js";
import Register from './Register';

export default function Login({ open, onClose, onLoginSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showRegister, setShowRegister] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);
    const isEmailValid = /^\S+@\S+\.\S+$/.test(email);
    const isValid = isEmailValid && password.trim() !== "";

    if (!open) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const resp = await login(email, password);
            console.log("Login response:", resp);
            setLoading(false);
            // notify parent (Navbar) about successful login
            if (onLoginSuccess) onLoginSuccess(resp?.data ?? resp);
            if (onClose) onClose();
        } catch (err) {
            setLoading(false);
            let message = "Error al iniciar sesión";
            if (err?.response?.status === 401) {
                message = "Datos incorrectos";
            } else if (err?.response?.data?.message) {
                message = err.response.data.message;
            } else if (err?.message) {
                message = err.message;
            }
            setError(message);
        }
    }

    return (
        <div className="login-modal-overlay" role="presentation">
                <div className="login-modal-content" tabIndex={0} role="dialog" aria-modal="true" aria-label="Inicio de sesión">

                    <button className="login-close-btn" onClick={onClose} aria-label="Cerrar" type="button">X</button>

                {showRegister ? (
                    <Register
                        onClose={() => { setShowRegister(false); if (onClose) onClose(); }}
                        onRegisterSuccess={(userData) => {
                            // propagate to Navbar so it shows the user immediately
                            if (onLoginSuccess) onLoginSuccess(userData);
                            setShowRegister(false);
                            if (onClose) onClose();
                        }}
                    />
                ) : (
                <form className="login-form" onSubmit={handleSubmit}>
                    <h2 className="form-title">Ingresá tu cuenta</h2>

                    <div className="input-container">
                        <label htmlFor="email-input" className="sr-only">Correo electrónico</label>
                        <input
                            id="email-input"
                            type="email"
                            placeholder="Ingresar email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => setEmailTouched(true)}
                            required
                            aria-invalid={emailTouched && !isEmailValid}
                            aria-describedby={emailTouched && !isEmailValid ? "email-error" : undefined}
                        />
                    </div>
                    {emailTouched && !isEmailValid && (
                        <p className="error-text" id="email-error" role="alert">Ingrese un email válido.</p>
                    )}

                    <div className="input-container">
                        <label htmlFor="password-input" className="sr-only">Contraseña</label>
                        <input
                            id="password-input"
                            type="password"
                            placeholder="Ingresar contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            aria-describedby={error ? "login-error" : undefined}
                        />
                    </div>

                    {error && <p className="error" id="login-error" role="alert">{error}</p>}

                    <button type="submit" className="submit" disabled={!isValid} aria-busy={loading}>
                        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </button>

                    <p className="login-signup-link">
                        <a href="/CrearCuenta" aria-label="Ir a crear nueva cuenta">Crear cuenta</a>
                    </p>
                </form>
                )}

            </div>
        </div>
    );
}
