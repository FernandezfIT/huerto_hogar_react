package cl.huertohogar.backend.catalogo;

import java.math.BigDecimal;

// datos del producto que se envian al frontend
public record ProductoDto(
        String id,
        String nombre,
        String descripcion,
        String categoriaId,
        String categoria,
        BigDecimal precio,
        BigDecimal precioOferta,
        Integer stock,
        String unidad,
        String origen,
        String imagen) {

    // convierte la entidad en dto
    public static ProductoDto desde(Producto producto) {
        return new ProductoDto(
                producto.getId(),
                producto.getNombre(),
                producto.getDescripcion(),
                producto.getCategoria().getId(),
                producto.getCategoria().getNombre(),
                producto.getPrecio(),
                producto.getPrecioOferta(),
                producto.getStock(),
                producto.getUnidad(),
                producto.getOrigen(),
                producto.getImagen());
    }
}
