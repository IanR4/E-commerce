import React, { useState, useEffect } from "react";
import "./Login.css";
import { login } from "../../service/usuariosService.js";
import Register from './Register';
import Sesion from "../../features/sesion/Sesion.jsx";

export default function Login({ open, onClose, onLoginSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showRegister, setShowRegister] = useState(false);
    // when modal opens, always show the login form (not the register form)
    useEffect(() => {
        if (open) {
            setShowRegister(false);
            setEmail("");
            setPassword("");
            setError(null);
            setEmailTouched(false);
        }
    }, [open]);
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
        <div className="login-modal-overlay">
            <div className="login-modal-content">

                <button className="login-close-btn" onClick={onClose}>X</button>

                {showRegister ? (
                    <Sesion
                        onClose={() => { setShowRegister(false); if (onClose) {setShowRegister(false); onClose(); } }}
                        onRegisterSuccess={(userData) => {
                            // propagate to Navbar so it shows the user immediately
                            if (onLoginSuccess) onLoginSuccess(userData);
                            setShowRegister(false);
                            if (onClose) onClose();
                        }}
                    />
                ) : (
                <form className="login-form" onSubmit={handleSubmit}>
                    <p className="form-title">Ingresá tu cuenta</p>

                    <div className="input-container">
                        <input
                            type="email"
                            placeholder="Ingresar email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => setEmailTouched(true)}
                            required
                        />
                    </div>
                    {emailTouched && !isEmailValid && (
                        <p className="error-text">Ingrese un email válido.</p>
                    )}

                    <div className="input-container">
                        <input
                            type="password"
                            placeholder="Ingresar contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="error">{error}</p>}

                    <button type="submit" className="submit" disabled={!isValid}>
                        Iniciar sesión
                    </button>

                    <p className="login-signup-link">
                         <a href="#" onClick={(e) => { e.preventDefault(); setShowRegister(true); }}>Crear cuenta</a>
                    </p>
                </form>
                )}

            </div>
        </div>
    );
}
