package cl.huertohogar.backend.catalogo;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

// logica de lectura del catalogo
@Service
@Transactional(readOnly = true)
public class CatalogoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    public CatalogoService(ProductoRepository productoRepository, CategoriaRepository categoriaRepository) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    // devuelve todos los productos ordenados por id
    public List<ProductoDto> listarProductos() {
        return productoRepository.findAllByOrderByIdAsc().stream()
                .map(ProductoDto::desde)
                .toList();
    }

    // devuelve un producto o error 404 si no existe
    public ProductoDto obtenerProducto(String id) {
        return productoRepository.findWithCategoriaById(id)
                .map(ProductoDto::desde)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado."));
    }

    // devuelve todas las categorias
    public List<CategoriaDto> listarCategorias() {
        return categoriaRepository.findAllByOrderByIdAsc().stream()
                .map(CategoriaDto::desde)
                .toList();
    }
}
