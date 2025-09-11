import { z } from "zod"

export class Usuario {
    constructor(id, nombre, email, telefono, tipo, fechaAlta) {
        //Ver despues
        z.object({
            id: z.number().nonnegative(),
            nombre: z.string().min(3).max(20),
            email: z.string().min(3).max(20),
            telefono: z.number().nonnegative(),
            
        })
        this.id = id
        this.nombre = nombre;
        this.email = email
        this.telefono = telefono
        this.tipo = tipo
        this.fechaAlta = fechaAlta
    }
}