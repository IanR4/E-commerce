import { z } from "zod"

export class Usuario {
    constructor(nombre, email, telefono, tipo) {
        //Ver despues
        z.object({
            id: z.number().nonnegative(),
            nombre: z.string().min(3).max(20),
            email: z.string().min(3).max(20),
            telefono: z.number().nonnegative(),
            
        })
        this.nombre = nombre
        this.email = email
        this.telefono = telefono
        this.tipo = tipo
        this.fechaAlta = new Date()
    }
}