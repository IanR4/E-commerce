import "./Login.css";

export default function Login({ open, onClose }) {
    if (!open) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">

                <button className="close-btn" onClick={onClose}>X</button>

                <form className="form">
                    <p className="form-title">Ingresá tu cuenta</p>

                    <div className="input-container">
                        <input type="email" placeholder="Ingresar email" />
                    </div>

                    <div className="input-container">
                        <input type="password" placeholder="Ingresar contraseña" />
                    </div>

                    <button type="submit" className="submit">Iniciar sesión</button>

                    <p className="signup-link">
                        <a href="/Sesion">Crear cuenta</a>
                    </p>
                </form>

            </div>
        </div>
    );
}
