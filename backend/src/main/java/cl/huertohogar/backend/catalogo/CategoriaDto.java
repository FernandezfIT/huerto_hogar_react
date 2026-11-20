package cl.huertohogar.backend.catalogo;

// datos de la categoria que se envian al frontend
public record CategoriaDto(String id, String nombre, String descripcion) {

    // convierte la entidad en dto
    public static CategoriaDto desde(Categoria categoria) {
        return new CategoriaDto(categoria.getId(), categoria.getNombre(), categoria.getDescripcion());
    }
}
