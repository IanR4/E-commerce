import UsuarioValidator from "../validators/usuarioValidator.js"
import AuthService from "../services/authService.js"

class AuthController {
    constructor() {
        this.usuarioValidator = UsuarioValidator;
        this.authService = new AuthService();
    }

    postRegister = (req, res) => {
        const { email, password, nombre, tipo, telefono } = req.body;
        const usuarioData = req.body;
        let resultBody;

        try {
            resultBody = this.usuarioValidator.validarUsuario(usuarioData);
        } catch (error) {
            return next(error);
        }

        this.authService.postRegister(email, password, nombre, tipo, telefono)
        .then(({ data, status }) => res.status(status).json(data))
        .catch(error => {
            if (error.message === 'El usuario ya existe') {
                return res.status(409).json({ message: error.message });
            }
            res.status(500).json({ 
                message: 'Error al registrar usuario',
                error: error.message 
            });
        });
    }

    postLogin = (req, res) => {
        const { email, password } = req.body;

        this.authService.postLogin(email, password)
        .then(({ data, status }) => res.status(status).json(data))
        .catch(error => {
            if (error.message === 'Usuario no encontrado' || 
                error.message === 'Contraseña incorrecta') {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }
            res.status(500).json({ 
                message: 'Error al iniciar sesión',
                error: error.message 
            });
        })
    };

}

export default new AuthController();

