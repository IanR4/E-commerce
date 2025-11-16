import { z } from "zod"
import UsuarioService from "../services/usuarioService.js"
import { TipoUsuario } from "../models/entities/tipoUsuario.js"
import UsuarioValidator from "../validators/usuarioValidator.js"

class UsuarioController{
  constructor() {
    this.usuarioValidator = UsuarioValidator;
    this.usuarioService = new UsuarioService();
  }

  getUsuario = (req, res, next) => {
    const usuarioId = req.params.usuarioId;

    try {
      this.usuarioValidator.validarUsuarioId(usuarioId);
    } catch (error) {
      return next(error);
    }
    return this.usuarioService.getUsuario(usuarioId)
      .then(({ data, status }) => res.status(status).json(data))
      .catch(next);
  };

  postUsuario = (req, res, next) => {
    const usuarioData = req.body;
    let resultBody;

    try {
      resultBody = this.usuarioValidator.validarUsuario(usuarioData);
    } catch (error) {
      return next(error);
    }

    return this.usuarioService.postUsuario(resultBody)
      .then(({ data, status }) => res.status(status).json(data))
      .catch(next);
  };


  getUsuarioLogin = (req, res, next) => {
    const usuarioData = req.body;

    return this.usuarioService.getUsuarioLogin(usuarioData)
      .then(({ data, status }) => res.status(status).json(data))
      .catch(next);
  };

  
}

export default new UsuarioController();
