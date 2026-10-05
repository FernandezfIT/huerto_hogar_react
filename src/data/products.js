/**
 * CATÁLOGO DE PRODUCTOS — HuertoHogar
 *
 * IDs, nombres, categorías, precios, unidades, stocks y descripciones salen
 * del enunciado del caso (FORMA A, "huerto.pdf"). El campo `origen` NO viene
 * del documento: el enunciado lo pide como requisito funcional pero no lo
 * completa, así que se simulan con regiones reales de producción agrícola
 * chilena para poder mostrarlo en la ficha de producto.
 *
 * El orden del array importa: el primer elemento tiene que seguir siendo
 * FR001 porque src/App.test.jsx toma el primer botón "Agregar al carrito"
 * para el flujo de integración y espera ese producto.
 */

export const products = [
    {
        id: "FR001",
        nombre: "Manzanas Fuji",
        categoria: "Frutas Frescas",
        precio: 1200,
        precioOferta: 990,
        unidad: "kilo",
        stock: 150,
        origen: "Valle del Maule",
        imagen: "/images/manzanas.jpeg",
        descripcion:
            "Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule. Perfectas para meriendas saludables o como ingrediente en postres. Estas manzanas son conocidas por su textura firme y su sabor equilibrado entre dulce y ácido.",
    },
    {
        id: "FR002",
        nombre: "Naranjas Valencia",
        categoria: "Frutas Frescas",
        precio: 1000,
        unidad: "kilo",
        stock: 200,
        origen: "Región de Coquimbo",
        imagen: "/images/naranjas.jpeg",
        descripcion:
            "Jugosas y ricas en vitamina C, estas naranjas Valencia son ideales para zumos frescos y refrescantes. Cultivadas en condiciones climáticas óptimas que aseguran su dulzura y jugosidad.",
    },
    {
        id: "FR003",
        nombre: "Plátanos Cavendish",
        categoria: "Frutas Frescas",
        precio: 800,
        unidad: "kilo",
        stock: 250,
        origen: "Región de Arica y Parinacota",
        imagen: "/images/platanos.svg",
        descripcion:
            "Plátanos maduros y dulces, perfectos para el desayuno o como snack energético. Estos plátanos son ricos en potasio y vitaminas, ideales para mantener una dieta equilibrada.",
    },
    {
        id: "VR001",
        nombre: "Zanahorias Orgánicas",
        categoria: "Verduras Orgánicas",
        precio: 900,
        precioOferta: 790,
        unidad: "kilo",
        stock: 100,
        origen: "Región de O'Higgins",
        imagen: "/images/zanahorias.jpeg",
        descripcion:
            "Zanahorias crujientes cultivadas sin pesticidas en la Región de O'Higgins. Excelente fuente de vitamina A y fibra, ideales para ensaladas, jugos o como snack saludable.",
    },
    {
        id: "VR002",
        nombre: "Espinacas Frescas",
        categoria: "Verduras Orgánicas",
        precio: 700,
        unidad: "bolsa de 500g",
        stock: 80,
        origen: "Región Metropolitana",
        imagen: "/images/espinacas.svg",
        descripcion:
            "Espinacas frescas y nutritivas, perfectas para ensaladas y batidos verdes. Estas espinacas son cultivadas bajo prácticas orgánicas que garantizan su calidad y valor nutricional.",
    },
    {
        id: "VR003",
        nombre: "Pimientos Tricolores",
        categoria: "Verduras Orgánicas",
        precio: 1500,
        precioOferta: 1290,
        unidad: "kilo",
        stock: 120,
        origen: "Región del Maule",
        imagen: "/images/pimientos.svg",
        descripcion:
            "Pimientos rojos, amarillos y verdes, ideales para salteados y platos coloridos. Ricos en antioxidantes y vitaminas, estos pimientos añaden un toque vibrante y saludable a cualquier receta.",
    },
    {
        id: "PO001",
        nombre: "Miel Orgánica",
        categoria: "Productos Orgánicos",
        precio: 5000,
        unidad: "frasco de 500g",
        stock: 50,
        origen: "Región de La Araucanía",
        imagen: "/images/miel.svg",
        descripcion:
            "Miel pura y orgánica producida por apicultores locales. Rica en antioxidantes y con un sabor inigualable, perfecta para endulzar de manera natural tus comidas y bebidas.",
    },
];