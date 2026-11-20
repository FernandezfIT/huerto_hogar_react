package cl.huertohogar.backend.catalogo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// entidad de la tabla categorias
@Entity
@Table(name = "categorias")
public class Categoria {

    @Id
    @Column(name = "id", length = 30, nullable = false)
    private String id;

    @Column(name = "nombre", length = 100, nullable = false)
    private String nombre;

    @Column(name = "descripcion", length = 1000, nullable = false)
    private String descripcion;

    // constructor vacio que pide jpa
    protected Categoria() {
    }

    // constructor para crear categorias
    public Categoria(String id, String nombre, String descripcion) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    // getters
    public String getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }
}
