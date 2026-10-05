```md
   # Cobertura de testing — Huerto Hogar React

   ## Objetivo

   Documentar qué partes del frontend fueron probadas, qué comportamientos cubren los tests y qué limitaciones quedan fuera del alcance actual.

   ## Herramientas usadas

   - **Vitest** como test runner.
   - **React Testing Library** para renderizar componentes e interactuar con la interfaz.
   - **jsdom** como entorno DOM simulado.
   - **jest-dom** para matchers como `toBeInTheDocument()`.
   - **user-event** para simular escritura y clicks como lo haría una persona.
   - **`vi.fn()`** para mocks de callbacks y servicios simulados.

   ## Decisión Vitest vs Jasmine/Karma

   La documentación académica menciona Jasmine/Karma, pero el docente recomendó usar Vitest. El equipo adoptó Vitest porque:

   - se integra directamente con Vite;
   - permite probar componentes React con React Testing Library;
   - facilita ejecución rápida local;
   - permite mocks con `vi.fn()`;
   - evita depender de Karma, herramienta actualmente menos usada en proyectos modernos con Vite.

   Esta decisión debe explicarse en la presentación si el docente pregunta por la diferencia con la pauta.

   ## Comando de ejecución

   ```bash
   npm run test -- --run
   ```

   Último resultado validado por el equipo:

   ```txt
   Test Files: 22 passed
   Tests:      275 passed
   ```

   El objetivo de la rúbrica era al menos 10 pruebas relevantes; la suite actual supera ese número por lejos. El desglose por archivo está en la tabla siguiente.

   ## Cobertura por archivo

   | Archivo de test | Tests | Área cubierta | Comportamientos principales |
   |---|---:|---|---|
   | `src/utils/catalog.test.js` | 55 | Reglas del catálogo | Lectura y derivación (precio de display, descuento, categorías con productos, conteo, ofertas, normalización de texto, búsqueda, filtro combinado) y CRUD completo: `validateProduct`, `createProduct`, `getProductById`, `updateProduct`, `deleteProduct`, incluidos id duplicado, categoría no declarada, precio/stock inválidos, oferta más cara que el precio, e integridad del array original. |
   | `src/hooks/useCart.test.jsx` | 22 | Estado global del carrito | Reducer y contexto: agregar, aumentar, disminuir, eliminar, limpiar, valores derivados, límite de stock, persistencia y recuperación desde `localStorage`, datos corruptos y uso fuera del provider. |
   | `src/utils/cartCalculations.test.js` | 14 | Cálculos de carrito | `getUnitPrice`, subtotales, total, cantidad total y límites de stock con y sin oferta. |
   | `src/utils/validators.test.js` | 17 | Validaciones | Nombre, correo, teléfono, dirección, espacios en blanco, cliente ausente y `hasErrors`. |
   | `src/components/CartSummary.test.jsx` | 18 | Resumen de carrito | Carrito vacío, listado, subtotales, total, precios tachados, aumentar, disminuir, eliminar, limpiar, botones deshabilitados al llegar al stock y exposición como lista. |
   | `src/pages/CatalogPage.test.jsx` | 19 | Página de catálogo | Render de los 7 productos, precio en oferta, alta al carrito, filtro por categoría, búsqueda por nombre, combinación de ambos, estado vacío, contador de resultados y filtros leídos desde la URL. |
   | `src/pages/CheckoutPage.test.jsx` | 14 | Checkout | Validación campo por campo, `aria-invalid` y `aria-describedby`, que un error de validación no crea orden ni vacía el carrito, compra exitosa con precio de oferta aplicado y compra fallida. |
   | `src/components/SearchBar.test.jsx` | 12 | Búsqueda | Etiqueta asociada, `type="search"`, `role="search"`, escritura tecla por tecla, botón Limpiar condicional, singular/plural del contador y texto de ayuda enlazado con `aria-describedby`. |
   | `src/pages/ProductDetailPage.test.jsx` | 12 | Ficha de producto | Datos y precio de la ficha, coherencia con el precio que cobra el carrito, `alt` de la imagen, alta al carrito, navegación y los tres estados del id inexistente. |
   | `src/data/products.test.js` | 10 | Datos del catálogo | Ids y orden del enunciado, unicidad, campos obligatorios, tipos, precio y stock enteros, oferta menor que el precio normal, categorías declaradas, existencia real de cada imagen en `public/` y coherencia del campo `sinProductos`. |
   | `src/pages/CartPage.test.jsx` | 10 | Página de carrito | Encabezado y estado vacío, no ofrecer checkout sin productos, total formateado, navegación, vaciar carrito y eliminar un producto puntual. |
   | `src/utils/cartStorage.test.js` | 9 | Persistencia | Guardar, cargar, limpiar, tolerar JSON inválido, payloads no array y `localStorage` bloqueado. |
   | `src/utils/checkoutService.test.js` | 9 | Servicio de checkout | Formato del identificador de orden, números distintos, total con oferta, subtotales, copia del cliente sin referencia y fallos por carrito vacío o stock insuficiente. |
   | `src/pages/CategoriesPage.test.jsx` | 8 | Vista de categorías | Una tarjeta por categoría con productos, exclusión de la categoría vacía, descripción de `categories.js`, conteo por categoría y enlaces al catálogo codificados. |
   | `src/pages/OrderSuccessPage.test.jsx` | 8 | Compra exitosa | Anuncio de éxito, datos del cliente, número de orden, líneas, subtotales, total y el caso sin orden. |
   | `src/components/CategoryFilter.test.jsx` | 7 | Filtro de categorías | Botón Todas, uno por categoría, contadores en el nombre accesible, `aria-pressed` y que las categorías no pasadas no se rendericen. |
   | `src/components/ProductCard.test.jsx` | 7 | Tarjeta de producto | Render, callback de alta, precio en oferta con descuento, producto sin oferta, datos visibles, enlace a la ficha y **navegación real** hasta la ficha. |
   | `src/pages/OffersPage.test.jsx` | 7 | Vista de ofertas | Solo los 3 productos con `precioOferta`, exclusión del resto, anuncio del mejor descuento, aviso de datos simulados y alta al carrito con el precio de oferta. |
   | `src/components/ProductList.test.jsx` | 4 | Grilla de productos | Una tarjeta por producto, callback con el producto elegido y mensajes de lista vacía. |
   | `src/App.test.jsx` | 6 | Integración general | Home → catálogo → carrito → checkout → éxito, recuperación del carrito desde `localStorage`, catálogo → detalle → carrito → checkout, id de producto desconocido, categorías → catálogo filtrado y ofertas. |
   | `src/pages/OrderFailurePage.test.jsx` | 6 | Compra fallida | Mensaje de error, motivo real, fallback genérico, carrito intacto y navegación posterior. |
   | `src/components/AppNavbar.test.jsx` | 1 | Navegación | Enlaces principales y badge del carrito. |

   ## Archivos de la app sin prueba propia

   Estos archivos se ejercitan de forma indirecta desde los tests de sus páginas, pero no tienen un archivo de test dedicado:

   - `src/layouts/MainLayout.jsx` (el footer va inline en este archivo).
   - `src/pages/HomePage.jsx`, `LoginPage.jsx`, `RegisterPage.jsx` y `ProfilePage.jsx`.
   - `src/utils/formatCurrency.js`.
   - `src/context/CartProvider.jsx` (cubierto desde `src/hooks/useCart.test.jsx`).

   ## Mocks y datos simulados

   Se utilizan principalmente:

   - `vi.fn()` para validar callbacks de componentes.
   - `localStorage` de jsdom para simular persistencia del carrito.
   - Fixtures en `src/test/cartFixtures.js` para reutilizar productos/carritos de prueba.
   - El parámetro `source` de `src/utils/catalog.js`, que permite probar las reglas del catálogo contra una lista de muestra sin tocar el catálogo real.
   - Servicios puros en `utils/` para aislar reglas de negocio y facilitar tests.

   ## Alcance cubierto

   La suite cubre:

   - renderizado de componentes críticos;
   - interacción de usuario en catálogo, filtros, búsqueda, carrito y checkout;
   - navegación principal con React Router, incluidas las rutas `/categorias`, `/ofertas` y `/producto/:id`;
   - persistencia del carrito;
   - validaciones de formulario;
   - cálculo de totales y ofertas;
   - reglas del catálogo y su CRUD simulado;
   - compra exitosa/fallida;
   - errores controlados y rutas inexistentes.

   ## Verificación de que los tests detectan fallas

   Un test que siempre pasa no demuestra nada. Durante la última etapa se comprobó que los tests agregados fallan cuando corresponde, mutando el código a propósito y restaurándolo después:

   - se renombró la ruta de la ficha en `ProductCard.test.jsx` y el test de navegación falló;
   - se alteró el texto esperado del encabezado de producto inexistente en `App.test.jsx` y el test falló.

   En ambos casos el archivo volvió a su estado correcto y la suite completa pasó.

   ## Limitaciones

   No se cubre todavía:

   - autenticación real de usuarios;
   - persistencia real de usuarios en backend;
   - integración con API externa;
   - pruebas end-to-end en navegador real;
   - cobertura visual/pixel perfect;
   - rendimiento;
   - accesibilidad automatizada completa;
   - la persistencia del carrito entre recargas de página reales: se simula con `localStorage` de jsdom dentro de un mismo entorno de test.

   ## Nota sobre el rendimiento de la suite

   Vitest advierte que crea un entorno `jsdom` por archivo y que eso concentra casi la mitad del tiempo de ejecución. No es un problema del código de la aplicación: si la suite empieza a demorar en la máquina del curso, se puede evaluar `pool: 'vmThreads'` en `vite.config.js`.

   ## Validación antes de entrega

   Antes de mergear o entregar, ejecutar:

   ```bash
   npm run test -- --run
   npm run build
   npm run lint
   ```

   Los tres comandos deben pasar sin errores.

   ```