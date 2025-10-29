import { z } from "zod"
import UsuarioService from "../services/usuarioService.js"
import { TipoUsuario } from "../models/entities/tipoUsuario.js"
import UsuarioValidator from "../validators/usuarioValidator.js"

class UsuarioController{
  constructor() {
    this.usuarioValidator = UsuarioValidator;
    this.usuarioService = new UsuarioService();
  }

  getUsuario = (req, res) => {
    const usuarioId = req.params.usuarioId;
    this.usuarioValidator.validarUsuarioId(usuarioId);
    this.usuarioService.getUsuario(usuarioId)
      .then(({ data, status }) => res.status(status).json(data));
  };

  postUsuario = (req, res) => {
    const usuarioData = req.body;
    const resultBody = this.usuarioValidator.validarUsuario(usuarioData);
    this.usuarioService.postUsuario(resultBody)
      .then(({ data, status }) => res.status(status).json(data))
  }
  
}

export default new UsuarioController();
