package cl.huertohogar.backend.catalogo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

// acceso a la tabla productos
public interface ProductoRepository extends JpaRepository<Producto, String> {

    // trae la categoria junto con el producto en una sola consulta
    @EntityGraph(attributePaths = "categoria")
    List<Producto> findAllByOrderByIdAsc();

    // busca un producto por id con su categoria
    @EntityGraph(attributePaths = "categoria")
    Optional<Producto> findWithCategoriaById(String id);
}
