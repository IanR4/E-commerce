class DireccionEntrega {
    constructor(calle, altura, piso, departamento, codigoPostal, ciudad, provincia, pais, lat, lon) {
        z.object({
                calle: z.string().min(3),
                altura: z.string().min(1),
                piso: z.string().optional(),
                departamento: z.string().optional(),
                codigoPostal: z.string().min(4).max(10),
                ciudad: z.string().min(2),
                provincia: z.string().min(2),
                pais: z.string().min(2),
                lat: z.string(),
                lon: z.string()
        })
        this.calle = calle
        this.altura = altura
        this.piso = piso
        this.departamento = departamento
        this.codigoPostal = codigoPostal
        this.ciudad = ciudad
        this.provincia = provincia
        this.pais = pais
        this.lat = lat
        this.lon = lon
    }
}