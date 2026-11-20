package cl.huertohogar.backend.catalogo;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;

class ProductoDtoTest {

    // datos de ejemplo
    private final Categoria frescas = new Categoria("frescas", "Frutas Frescas", "descripcion");

    private Producto producto(BigDecimal oferta) {
        return new Producto("FR001", frescas, "Manzanas Fuji", "descripcion",
                new BigDecimal("1200"), oferta, 150, "kilo", "Valle del Maule", "/images/manzanas.jpeg");
    }

    // el dto trae categoriaId y nombre de categoria
    @Test
    void mapeaCategoriaIdYNombre() {
        ProductoDto dto = ProductoDto.desde(producto(new BigDecimal("990")));

        assertEquals("FR001", dto.id());
        assertEquals("frescas", dto.categoriaId());
        assertEquals("Frutas Frescas", dto.categoria());
        assertEquals(new BigDecimal("990"), dto.precioOferta());
    }

    // sin oferta precioOferta queda nulo
    @Test
    void sinOfertaDejaPrecioOfertaNulo() {
        ProductoDto dto = ProductoDto.desde(producto(null));

        assertNull(dto.precioOferta());
        assertEquals(new BigDecimal("1200"), dto.precio());
    }
}
