
 ```md
   # Cobertura de testing — Huerto Hogar React

   ## Objetivo

   Documentar qué partes del frontend fueron probadas, qué comportamientos cubren los tests y qué limitaciones quedan fuera del alcance actual.

   ## Herramientas usadas

   - **Vitest** como test runner.
   - **React Testing Library** para renderizar componentes e interactuar con la interfaz.
   - **jsdom** como entorno DOM simulado.
   - **jest-dom** para matchers como `toBeInTheDocument()`.
   - **vi.fn()`** para mocks de callbacks y servicios simulados.

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
   Test Files: 13 passed
   Tests: 131 passed
 ```

 Cobertura por archivo

 ┌─────────────────────────────────────┬─────────────────────────┬────────────────────────────────────────────────────────────────────────────────────────┐
 │ Archivo de test                     │ Área cubierta           │ Comportamientos principales                                                            │
 ├─────────────────────────────────────┼─────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
 │ src/App.test.jsx                    │ Integración general     │ Home → catálogo → carrito → checkout → éxito; recuperación del carrito desde           │
 │                                     │                         │ localStorage.                                                                          │
 ├─────────────────────────────────────┼─────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
 │ src/components/AppNavbar.test.jsx   │ Navegación              │ Render de enlaces principales y badge de carrito.                                      │
 ├─────────────────────────────────────┼─────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
 │ src/components/ProductCard.test.jsx │ Producto                │ Render de producto y callback al agregar al carrito.                                   │
 ├─────────────────────────────────────┼─────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
 │ src/components/CartSummary.test.jsx │ Resumen de carrito      │ Carrito vacío, productos, cantidades, total, aumentar, disminuir, eliminar y limpiar.  │
 ├─────────────────────────────────────┼─────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
 │ src/hooks/useCart.test.jsx          │ Estado global de        │ Reducer/contexto, agregar, aumentar, disminuir, eliminar, limpiar, persistir y         │
 │                                     │ carrito                 │ recuperar.                                                                             │
 ├─────────────────────────────────────┼─────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
 │ src/pages/CartPage.test.jsx         │ Página de carrito       │ Render de carrito, total, navegación a checkout y comportamiento con carrito vacío.    │
 ├─────────────────────────────────────┼─────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
 │ src/pages/CheckoutPage.test.jsx     │ Checkout                │ Validación de formulario, compra exitosa, compra fallida y preservación/vaciado del    │
 │                                     │                         │ carrito.                                                                               │
 ├─────────────────────────────────────┼─────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
 │ src/pages/OrderSuccessPage.test.jsx │ Compra exitosa          │ Render de orden, total pagado, productos y caso sin orden.                             │
 ├─────────────────────────────────────┼─────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
 │ src/pages/OrderFailurePage.test.jsx │ Compra fallida          │ Mensaje de error, fallback de error inesperado y navegación posterior.                 │
 ├─────────────────────────────────────┼─────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
 │ src/utils/cartCalculations.test.js  │ Cálculos de carrito     │ Subtotales, total, cantidad total, ofertas y límites de stock.                         │
 ├─────────────────────────────────────┼─────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
 │ src/utils/cartStorage.test.js       │ Persistencia            │ Guardar, cargar, limpiar y tolerar datos corruptos de localStorage.                    │
 ├─────────────────────────────────────┼─────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
 │ src/utils/checkoutService.test.js   │ Servicio de checkout    │ Creación de orden, totales, stock insuficiente y errores de carrito vacío.             │
 ├─────────────────────────────────────┼─────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
 │ src/utils/validators.test.js        │ Validaciones            │ Nombre, email, teléfono, dirección y detección de errores.                             │
 └─────────────────────────────────────┴─────────────────────────┴────────────────────────────────────────────────────────────────────────────────────────┘

 Mocks y datos simulados

 Se utilizan principalmente:

 - vi.fn() para validar callbacks de componentes.
 - localStorage de jsdom para simular persistencia del carrito.
 - Fixtures en src/test/cartFixtures.js para reutilizar productos/carritos de prueba.
 - Servicios puros en utils/ para aislar reglas de negocio y facilitar tests.

 Alcance cubierto

 La suite cubre:

 - renderizado de componentes críticos;
 - interacción de usuario en carrito y checkout;
 - navegación principal con React Router;
 - persistencia del carrito;
 - validaciones de formulario;
 - cálculo de totales y ofertas;
 - compra exitosa/fallida;
 - errores controlados.

 Limitaciones

 No se cubre todavía:

 - autenticación real de usuarios;
 - persistencia real de usuarios en backend;
 - integración con API externa;
 - pruebas end-to-end en navegador real;
 - cobertura visual/pixel perfect;
 - rendimiento;
 - accesibilidad automatizada completa.

 Validación antes de entrega

 Antes de mergear o entregar, ejecutar:

 ```bash
   npm run test -- --run
   npm run build
 ```

 Ambos comandos deben pasar sin errores.

 ```
