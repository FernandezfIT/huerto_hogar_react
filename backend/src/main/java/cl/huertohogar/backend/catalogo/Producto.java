package cl.huertohogar.backend.catalogo;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

// entidad de la tabla productos
@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @Column(name = "id", length = 20, nullable = false)
    private String id;

    // cada producto pertenece a una categoria
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @Column(name = "nombre", length = 120, nullable = false)
    private String nombre;

    @Column(name = "descripcion", length = 1000, nullable = false)
    private String descripcion;

    // precios en pesos enteros
    @Column(name = "precio", precision = 19, scale = 0, nullable = false)
    private BigDecimal precio;

    // puede ser null si no hay oferta
    @Column(name = "precio_oferta", precision = 19, scale = 0)
    private BigDecimal precioOferta;

    @Column(name = "stock", nullable = false)
    private Integer stock;

    @Column(name = "unidad", length = 50, nullable = false)
    private String unidad;

    @Column(name = "origen", length = 100, nullable = false)
    private String origen;

    @Column(name = "imagen", length = 255, nullable = false)
    private String imagen;

    // constructor vacio que pide jpa
    protected Producto() {
    }

    // constructor para crear productos
    public Producto(String id, Categoria categoria, String nombre, String descripcion,
            BigDecimal precio, BigDecimal precioOferta, Integer stock,
            String unidad, String origen, String imagen) {
        this.id = id;
        this.categoria = categoria;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.precioOferta = precioOferta;
        this.stock = stock;
        this.unidad = unidad;
        this.origen = origen;
        this.imagen = imagen;
    }

    // getters
    public String getId() {
        return id;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public String getNombre() {
        return nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public BigDecimal getPrecioOferta() {
        return precioOferta;
    }

    public Integer getStock() {
        return stock;
    }

    public String getUnidad() {
        return unidad;
    }

    public String getOrigen() {
        return origen;
    }

    public String getImagen() {
        return imagen;
    }
}
