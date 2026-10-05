/**
 * CATEGORÍAS — HuertoHogar
 *
 * Las cuatro categorías y sus textos salen del enunciado del caso
 * ("huerto.pdf", página 7).
 *
 * OJO con "Productos Lácteos": la categoría está en el documento pero el único
 * producto que traía (PL001 Leche Entera) no tiene precio, unidad ni stock
 * definidos, así que el equipo decidió no incluirlo. Por eso esa categoría no
 * tiene productos y la interfaz nunca la muestra. Si más adelante se agrega un
 * producto lácteo, vuelve a aparecer sola: el filtro y la vista de categorías
 * se derivan de los productos que existen, no de esta lista.
 */

export const categories = [
    {
        id: "frescas",
        nombre: "Frutas Frescas",
        descripcion:
            "Nuestra selección de frutas frescas ofrece una experiencia directa del campo a tu hogar. Estas frutas se cultivan y cosechan en el punto óptimo de madurez para asegurar su sabor y frescura. Disfruta de una variedad de frutas de temporada que aportan vitaminas y nutrientes esenciales a tu dieta diaria. Perfectas para consumir solas, en ensaladas o como ingrediente principal en postres y smoothies.",
    },
    {
        id: "organicas",
        nombre: "Verduras Orgánicas",
        descripcion:
            "Descubre nuestra gama de verduras orgánicas, cultivadas sin el uso de pesticidas ni químicos, garantizando un sabor auténtico y natural. Cada verdura es seleccionada por su calidad y valor nutricional, ofreciendo una excelente fuente de vitaminas, minerales y fibra. Ideales para ensaladas, guisos y platos saludables, nuestras verduras orgánicas promueven una alimentación consciente y sostenible.",
    },
    {
        id: "organicos",
        nombre: "Productos Orgánicos",
        descripcion:
            "Nuestros productos orgánicos están elaborados con ingredientes naturales y procesados de manera responsable para mantener sus beneficios saludables. Desde aceites y miel hasta granos y semillas, ofrecemos una selección que apoya un estilo de vida saludable y respetuoso con el medio ambiente. Estos productos son perfectos para quienes buscan opciones alimenticias que aporten bienestar sin comprometer el sabor ni la calidad.",
    },
    {
        id: "lacteos",
        nombre: "Productos Lácteos",
        sinProductos: true,
        descripcion:
            "Los productos lácteos de HuertoHogar provienen de granjas locales que se dedican a la producción responsable y de calidad. Ofrecemos una gama de leches, yogures y otros derivados que conservan su frescura y sabor auténtico. Ricos en calcio y nutrientes esenciales, nuestros lácteos son perfectos para complementar una dieta equilibrada, proporcionando el mejor sabor y nutrición para toda la familia.",
    },
];