import { z } from "zod"
import UsuarioService from "../services/usuarioService.js"
import { TipoUsuario } from "../models/entities/tipoUsuario.js"


const usuarioSchema = z.object({
    nombre: z.string().min(3).max(20),
    email: z.string().email(),
    telefono: z.string().min(8).max(15),
    tipo: z.nativeEnum(TipoUsuario)
})

class UsuarioController{
  constructor() {
    this.usuarioService = new UsuarioService();
  }

  getUsuario = (req, res, next) => {
    const usuarioId = parseInt(req.params.usuarioId, 10);
    if (isNaN(usuarioId)) {
      return res.status(400).json({ error: "Invalid usuarioId parameter" });
    }
    this.usuarioService.getUsuario(usuarioId)
      .then(({ data, status }) => res.status(status).json(data))
      .catch(next);
  };

  postUsuario = (req, res, next) => {
    const usuarioData = req.body;
    const resultBody = usuarioSchema.safeParse(usuarioData)
    this.usuarioService.postPedido(resultBody.data)
      .then(({ data, status }) => res.status(status).json(data))
      .catch(next);
  }
}

export default new UsuarioController();
