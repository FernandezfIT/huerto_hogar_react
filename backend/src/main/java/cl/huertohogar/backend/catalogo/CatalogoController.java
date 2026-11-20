package cl.huertohogar.backend.catalogo;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// rutas publicas de lectura del catalogo
@RestController
@RequestMapping("/api/v1")
public class CatalogoController {

    private final CatalogoService catalogoService;

    public CatalogoController(CatalogoService catalogoService) {
        this.catalogoService = catalogoService;
    }

    // get /api/v1/productos
    @GetMapping("/productos")
    public List<ProductoDto> listarProductos() {
        return catalogoService.listarProductos();
    }

    // get /api/v1/productos/{id}
    @GetMapping("/productos/{id}")
    public ProductoDto obtenerProducto(@PathVariable String id) {
        return catalogoService.obtenerProducto(id);
    }

    // get /api/v1/categorias
    @GetMapping("/categorias")
    public List<CategoriaDto> listarCategorias() {
        return catalogoService.listarCategorias();
    }
}
