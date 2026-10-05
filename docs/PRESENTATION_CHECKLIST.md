
 ```md
   # Checklist de presentación — Huerto Hogar React EV2

   ## 1. Antes de presentar

   Ejecutar y confirmar:

   ```bash
   npm install
   npm run test -- --run
   npm run build
   npm run dev
 ```

 Verificar:

 - [ ] La app abre en navegador.
 - [ ] El navbar permite navegar entre páginas.
 - [ ] El catálogo muestra productos.
 - [ ] El carrito suma productos y actualiza el badge.
 - [ ] El carrito permite aumentar, disminuir, eliminar y limpiar.
 - [ ] El carrito persiste al recargar.
 - [ ] El checkout valida campos.
 - [ ] La compra exitosa muestra resumen.
 - [ ] La compra fallida conserva el carrito.
 - [ ] Login, registro y perfil se presentan como vistas frontend simuladas.
 - [ ] README, ERS V2 y cobertura están actualizados.

 2. Flujo sugerido de demostración

 1. Abrir Home.
 2. Ir a Catálogo.
 3. Agregar un producto.
 4. Mostrar contador del carrito en navbar.
 5. Entrar a Carrito.
 6. Aumentar/disminuir cantidad.
 7. Ir a Checkout.
 8. Intentar confirmar con datos inválidos para mostrar validaciones.
 9. Completar datos válidos.
 10. Confirmar compra.
 11. Mostrar página de éxito.
 12. Explicar que login/registro/perfil son maqueta frontend sin backend.

 3. Preguntas que cada integrante debe poder responder

 - ¿Qué parte del proyecto implementaste?
 - ¿Qué componentes creaste o modificaste?
 - ¿Qué props recibe cada componente importante?
 - ¿Dónde vive el estado del carrito?
 - ¿Por qué se usa CartProvider y useCart()?
 - ¿Cómo funciona la navegación con React Router?
 - ¿Qué hace localStorage en este proyecto?
 - ¿Qué validaciones tiene el checkout?
 - ¿Qué pruebas cubren tu parte?
 - ¿Por qué se usó Vitest en vez de Jasmine/Karma?
 - ¿Qué limitaciones tiene esta versión?

 4. Respuestas técnicas clave

 ### ¿Dónde vive el estado del carrito?

 Vive en CartProvider, usando un reducer y el hook useCart() para consumirlo desde componentes.

 ### ¿Por qué no vive en App.jsx?

 Porque App.jsx ahora se encarga principalmente del enrutamiento. Separar el carrito en contexto evita duplicar estado y permite acceder al carrito desde
 navbar, catálogo, carrito y checkout.

 ### ¿Qué hace React Router?

 Permite que cada vista tenga una ruta real, por ejemplo:

 - /
 - /catalogo
 - /carrito
 - /checkout
 - /login
 - /registro
 - /perfil

 ### ¿Dónde se almacenan los usuarios registrados?

 No se almacenan. Login, registro y perfil son vistas frontend simuladas. La app no tiene backend ni base de datos, por lo que no implementa autenticación
 real.

 ### ¿Dónde se almacena el carrito?

 En localStorage, para que el carrito se conserve al recargar la página en el mismo navegador.

 ### ¿Por qué Vitest?

 Porque el docente recomendó Vitest y el proyecto usa Vite. Vitest se integra bien con Vite, permite pruebas rápidas y funciona junto con React Testing
 Library.

 5. Riesgos o limitaciones a declarar

 - No hay backend real.
 - No hay base de datos.
 - No hay autenticación real.
 - No hay pagos reales.
 - No hay despacho real.
 - El catálogo usa datos simulados.
 - Las pruebas no son end-to-end en navegador real.
 ```
