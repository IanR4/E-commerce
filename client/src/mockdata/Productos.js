const productos = [
  {
    id: 1,
    titulo: "Remera Urban Fit",
    descripcion:
      "Remera de algodón orgánico con corte moderno y diseño minimalista. Suave al tacto, ideal para uso diario o actividades al aire libre.",
    moneda: "ARS",
    stock: 10,
    precio: 15800,
    imagen: "/images/remeraurbanfit.jpg",
  },
  {
    id: 2,
    titulo: "Zapatillas Runner Pro",
    descripcion:
      "Zapatillas deportivas ultraligeras con suela antideslizante y plantilla ergonómica. Perfectas para entrenamiento o running urbano.",
    moneda: "ARS",
    stock: 20,
    precio: 24700,
    imagen: "/images/zapatillasrunnerpro.jpg",
  },
  {
    id: 3,
    titulo: "Auriculares Bluetooth",
    descripcion:
      "Auriculares inalámbricos con cancelación de ruido y batería de larga duración. Sonido envolvente y conexión estable.",
    moneda: "ARS",
    stock: 30,
    precio: 12000,
    imagen: "/images/auricularesbluetooth.jpg",
  },
  {
    id: 4,
    titulo: "Perfume Essentiel",
    descripcion:
      "Fragancia fresca y elegante con notas cítricas y amaderadas. Ideal para uso diario o para ocasiones especiales.",
    moneda: "ARS",
    stock: 15,
    precio: 12050,
    imagen: "/images/perfume.jpg",
  },
  {
    id: 5,
    titulo: "Desodorante Natural Fresh",
    descripcion:
      "Desodorante sin aluminio, con ingredientes naturales y aroma suave. Protege eficazmente durante todo el día.",
    moneda: "ARS",
    stock: 25,
    precio: 9800,
    imagen: "/images/catedralbariloche.jpg",
  },
  {
    id: 6,
    titulo: "Smartwatch FitZone X",
    descripcion:
      "Reloj inteligente con monitor de ritmo cardíaco, contador de pasos y resistencia al agua. Compatible con Android e iOS.",
    moneda: "ARS",
    stock: 5,
    precio: 32000,
    imagen: "/images/llaollao.jpg",
  },
  {
    id: 7,
    titulo: "Notebook AlvearBook 15”",
    descripcion:
      "Laptop ultradelgada con pantalla Full HD, procesador Intel i7 y batería de alta duración. Ideal para trabajo y estudio.",
    moneda: "ARS",
    stock: 50,
    precio: 98000,
    imagen: "/images/alvearpalace.jpg",
  },
  {
    id: 8,
    titulo: "Cámara Digital ProShot",
    descripcion:
      "Cámara compacta de alta resolución con zoom óptico 10x. Ideal para capturar momentos únicos con calidad profesional.",
    moneda: "ARS",
    stock: 40,
    precio: 31000,
    imagen: "/images/roma1.jpg",
  },
  {
    id: 9,
    titulo: "Smart TV LeView 55” 4K",
    descripcion:
      "Televisor inteligente con resolución Ultra HD, conexión Wi-Fi y sistema operativo integrado. Imagen nítida y colores vibrantes.",
    moneda: "ARS",
    stock: 60,
    precio: 225000,
    imagen: "/images/roma2.jpg",
  },
  {
    id: 10,
    titulo: "Lámpara Eiffel Deco",
    descripcion:
      "Lámpara decorativa de diseño moderno inspirada en la Torre Eiffel. Ideal para ambientes acogedores y contemporáneos.",
    moneda: "ARS",
    stock: 100,
    precio: 88000,
    imagen: "/images/roma3.jpg",
  },
  {
    id: 11,
    titulo: "Parlante Bluetooth Pulse Max",
    descripcion:
      "Parlante portátil con sonido envolvente 360°, luces LED y batería recargable. Perfecto para fiestas y reuniones.",
    moneda: "ARS",
    stock: 50,
    precio: 125000,
    imagen: "/images/trocadero.jpg",
  },
  {
    id: 12,
    titulo: "Cafetera Roma Barista",
    descripcion:
      "Cafetera espresso automática con vaporizador de leche y diseño elegante. Disfrutá café profesional en casa.",
    moneda: "ARS",
    stock: 45,
    precio: 142000,
    imagen: "/images/madrid1.jpg",
  },
  {
    id: 13,
    titulo: "Mochila UrbanPack",
    descripcion:
      "Mochila resistente al agua con múltiples compartimentos y espacio para notebook. Ideal para ciudad o viajes.",
    moneda: "ARS",
    stock: 90,
    precio: 86000,
    imagen: "/images/madrid2.jpg",
  },
  {
    id: 14,
    titulo: "Set de Cuidado Facial St. Regis",
    descripcion:
      "Kit premium con crema hidratante, sérum antioxidante y limpiador facial. Ideal para rutina de belleza diaria.",
    moneda: "ARS",
    stock: 55,
    precio: 215000,
    imagen: "/images/lemeurice.jpg",
  },
  {
    id: 15,
    titulo: "Botines",
    descripcion:
      "Botines de cuero genuino con diseño clásico y suela antideslizante. Comodidad y estilo para toda ocasión.",
    moneda: "ARS",
    stock: 70,
    precio: 98000,
    imagen: "/images/pullman.jpg",
  },
  {
    id: 16,
    titulo: "Colonia Meliá Blue",
    descripcion:
      "Colonia fresca con notas marinas y cítricas. Ideal para quienes buscan una fragancia ligera y sofisticada.",
    moneda: "ARS",
    stock: 40,
    precio: 72000,
    imagen: "/images/llaollao.jpg",
  },
  {
    id: 17,
    titulo: "Campera Patagonia Explorer",
    descripcion:
      "Campera térmica impermeable con interior polar. Perfecta para climas fríos y actividades al aire libre.",
    moneda: "ARS",
    stock: 140,
    precio: 21000,
    imagen: "/images/skybariloche.jpg",
  },
  {
    id: 18,
    titulo: "Vino Reserva Santiago",
    descripcion:
      "Vino tinto reserva elaborado en el Valle del Maipo. Aromas intensos y sabor equilibrado con notas de roble.",
    moneda: "ARS",
    stock: 34,
    precio: 68000,
    imagen: "/images/cordobacenter.jpg",
  },
  {
    id: 19,
    titulo: "Reloj W Chrono Steel",
    descripcion:
      "Reloj analógico de acero inoxidable con cronógrafo y correa ajustable. Estilo y precisión en un mismo diseño.",
    moneda: "ARS",
    stock: 50,
    precio: 89000,
    imagen: "/images/alvearpalace.jpg",
  },
  {
    id: 20,
    titulo: "Mate Cusco Tradicional",
    descripcion:
      "Set de mate artesanal hecho a mano con calabaza natural y bombilla de acero inoxidable. Diseño auténtico y duradero.",
    moneda: "ARS",
    stock: 90,
    precio: 35000,
    imagen: "/images/roma1.jpg",
  },
];

export { productos };