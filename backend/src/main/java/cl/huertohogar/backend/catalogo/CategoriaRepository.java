package cl.huertohogar.backend.catalogo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

// acceso a la tabla categorias
public interface CategoriaRepository extends JpaRepository<Categoria, String> {

    // lista ordenada por id
    List<Categoria> findAllByOrderByIdAsc();
}
