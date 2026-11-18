# Ruta A — catálogo y datos

> **Entrega integrada antes del cierre interno del 25/11/2026.** Objetivos intermedios: base compartida el 18/11, lectura real el 20/11, recorrido integrado el 22/11 y verificación el 24/11. Fecha docente por confirmar.

Leer [coordinación](COORDINACION.md), [contratos](CONTRATOS.md) y [pruebas](PRUEBAS.md). Esta ruta no incluye CRUD ni inventario transaccional.

## Entregable y propiedad

Catálogo, categorías, ofertas y detalle desde MySQL, conservando componentes, URLs y carrito existentes. El navegador debe consumir datos reales y B debe poder usar la fuente compartida.

**Archivos propios:**
- `backend/src/main/java/cl/huertohogar/backend/catalogo/**` y tests correspondientes.
- `backend/src/main/resources/db/migration/V1__catalogo.sql` y `V2__semilla_catalogo.sql`, si las versiones siguen libres.
- `src/services/productService.js`, `src/context/CatalogProvider.jsx`, `src/hooks/useCatalog.js`.
- `src/pages/CatalogPage.jsx`, `CategoriesPage.jsx`, `OffersPage.jsx`, `ProductDetailPage.jsx` y sus tests.
- `src/utils/catalog.js`, sus tests y adaptaciones mínimas de componentes de catálogo.

**No editar en paralelo:** App/navbar de B; seguridad/HTTP/config/pom de C; carrito/storage de B. Solicitar ajustes a sus dueños.

## A1 — revisar consumidores y preparar datos

1. Leer las cuatro páginas y buscar imports directos o indirectos de products/categories. Incluir defaults de funciones en `src/utils/catalog.js`.
2. Registrar los campos usados: categoría por nombre para UI, categoriaId para contrato, precioOferta, unidad, stock, imágenes e idString.
3. Preparar fixtures compatibles: producto con oferta, sin oferta/null, agotado y categoría sin productos. Solo para tests/desarrollo aislado; nunca fallback de producción.
4. Conservar siete productos y cuatro categorías existentes. FR001 sigue siendo Manzanas Fuji; no convertir ID a Long ni crear lácteos sin datos.
5. Acordar con C versiones de migraciones y nombres de tablas antes de escribir SQL definitivo.

**Aceptación:** inventario breve en el PR y ejemplos JSON revisados con B/C. Puede hacerse sin JWT ni backend completo.

## A2 — migraciones, entidades y DTO

1. Crear V1 con categorías/productos, PK/FK y restricciones de precio/stock del contrato. Crear V2 con semilla fiel al frontend; no scripts de DROP/reset.
2. Precio y oferta BigDecimal/DECIMAL(19,0); stock entero; oferta nullable. Campos String con límites consistentes. Sin @Version o tabla de inventario para una compra que no existe.
3. Crear entidades y repositorios de catálogo. Salida mediante DTO explícito, no entidades con relaciones recursivas.
4. Si falta base C (E01), preparar SQL/DTO y fixtures, pero no afirmar compilación conjunta.
5. Con C (E02), aplicar migraciones sobre MySQLtest dedicado. Verificar semilla y segundo arranque sin duplicar ni restaurar datos.

**Aceptación:** V1/V2 revisadas por C, entidades alineadas con validate y datos originales disponibles. Si existen migraciones aplicadas, no sobrescribirlas: acordar versiones nuevas.

## A3 — API de lectura

1. Implementar GET `/api/v1/productos`, ordenado por id; GET `/productos/{id}` con 404; GET `/categorias` con metadatos.
2. Mapear categoriaId y categoria(nombre) en DTOproducto; precioOferta null cuando no exista.
3. Reutilizar errores comunes de C; no crear otra respuesta de seguridad o controlador de login.
4. Entregar un primer GET real a B en cuanto esté disponible, sin esperar todas las páginas terminadas.
5. Ejecutar T01 con MySQL real. Un repositorio mock no cierra persistencia.

**No implementar:** POST/PUT/DELETE de productos, CRUD de categorías, Kstock, bloqueos, descuento, reservas, pedidos, paginación o nuevas imágenes.

**Aceptación E03:** GET verificable contra BD; público para Invitado y usuarios autenticados. C aplica Security; no quitar seguridad general porque falle un GET.

## A4 — servicio y fuente compartida

1. Crear productService usando request de C (E04), con exports exactos del contrato. Sin otro wrapper Fetch o URL absoluta dispersa.
2. Normalizar precioOferta null a undefined/propiedad ausente antes de helpers actuales. Evitar oferta100% falsa.
3. Implementar CatalogProvider/useCatalog con `{products,categories,status,error,reload}`. Manejar carga, cancelación y respuestas tardías.
4. Solo status=success con array vacío significa catálogo vacío. API caída es error; no sustituir con products.js.
5. Entregar provider/hook exportados a B (E07), quien los monta en App. No editar App simultáneamente.
6. No borrar la última colección válida por error presentándola como stock agotado. B reconcilia carrito solo tras carga exitosa.

**Aceptación:** B puede consumir fuente común sin conocer internamente el servicio. Un fake contractual permite adelantar UI, pero no acreditar API real.

## A5 — conectar las cuatro vistas

1. **CatalogPage:** conservar parámetros URL `categoria` y `q`, búsqueda/filtro y callback addItem. Mostrar carga/error/vacío/reintento. Pasar colección real a helpers, sin defaults estáticos ocultos.
2. **CategoriesPage:** metadatos de API y conteos según productos reales. Lácteos sin productos no aparece como categoría disponible con productos.
3. **OffersPage:** incluir solo oferta válida; no confundir null con oferta. Mantener cards y navegación.
4. **ProductDetailPage:** conservar prop `idDelProducto` usada por App o coordinar cambio con B. Cargar por id; manejar 404/error/loading y cambio de parámetro sin producto anterior.
5. Ajustar `categoriesWithProducts` para recibir metadatos de categorías reales, no mantener categories.js como autoridad productiva. Actualizar consumidores y tests.
6. Revisar `getOffers`, `discountPercent` y filtros. Los datos estáticos pueden quedar en tests/historial, no alimentar páginas productivas.
7. Implementar T02 de API caída y adaptar pruebas afectadas por asincronía sin borrar validaciones útiles.

## A6 — integración, evidencia y entrega

- Con B: catálogo→detalle→carrito con datos MySQL. Verificar oferta ausente, stock0 y producto inexistente.
- Con C: demostrar consulta BD, migraciones y reinicio. Cambiar un dato de prueba y verlo tras reload sin editar products.js.
- Revisar ruta B y confirmar que la conexión al carrito no usa fixtures productivos.
- Ejecutar pruebas propias y checks de combinación; registrar comandos y resultados reales, nunca una cifra histórica como resultado actual.
- Aportar modelo, DTOs, semilla y comandos verificados al README de ejecución.
- Explicar MySQL→repository→service→DTO→HTTP→hook→card y realizar una modificación pequeña comprobable.

## Dependencias y actuación

| Falta | Adelantar | No declarar terminado |
|---|---|---|
| E01 base C | Inventario, SQL, fixtures, DTO | API compilable integrada |
| E02 Flyway/BDtest | Revisión SQL y pruebas puras | Persistencia MySQL |
| E04 request C | UI/hook con fake compatible | HTTP real |
| E07 montaje B | Páginas aisladas | Navegación final |

## Checklist A — previo al 25/11

- [ ] V1/V2 y DTOs respetan contratos y datos existentes.
- [ ] GET de productos/detalle/categorías conectados a BD.
- [ ] Cuatro vistas sin fallback JS productivo.
- [ ] Null, ofertas, categorías vacías, 404 y errores controlados.
- [ ] CatalogProvider entregado y montado por B.
- [ ] T01/T02 y regresión registrados sin evidencia inventada.
- [ ] PR revisado, documentación y explicación propia.

## Instrucción reutilizable para agente de Ruta A

> Inspecciona el repositorio. Lee docs/EV3/COORDINACION.md, CONTRATOS.md, PRUEBAS.md y esta guía. Implementa únicamente la tarea A asignada, conservando frontend y contratos. Antes de editar indica archivos e interfaces afectados. No crees CRUD, pedidos, seguridad paralela o cliente HTTP propio. No cambies archivos B/C sin coordinación. Informa diff, pruebas ejecutadas, resultados reales y bloqueos Exx. Git e instalaciones requieren autorización de quien te asigna la tarea. Cierre interno 25/11/2026: no sacrifiques controles para aparentar terminado.
