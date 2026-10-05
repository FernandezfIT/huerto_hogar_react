# ERS V2 — Huerto Hogar React

## 1. Propósito

Este documento describe los requisitos actuales de la versión React del ecommerce Huerto Hogar para EV2 de Desarrollo FullStack II.

La aplicación migra la experiencia base del ecommerce a React/Vite, incorporando componentes reutilizables, navegación, carrito persistente, checkout
 simulado, validaciones, diseño responsivo y pruebas automatizadas.

## 2. Alcance

Incluye:

- catálogo de productos simulados;
- navegación pública;
- carrito de compras;
- persistencia local del carrito;
- checkout con validación de datos;
- resultado de compra exitosa o fallida;
- páginas públicas de login, registro y perfil como maqueta frontend;
- pruebas unitarias/de integración con Vitest.

No incluye:

- backend real;
- base de datos;
- autenticación real;
- registro persistente de usuarios;
- pagos reales;
- despacho real;
- integración con APIs externas.

## 3. Usuarios

### Cliente visitante

Puede revisar productos, agregar productos al carrito, simular una compra y navegar por páginas públicas.

### Integrante del equipo

Puede mantener componentes, rutas, pruebas y documentación del proyecto.

### Docente/evaluador

Puede revisar cumplimiento de requisitos, ejecutar pruebas, compilar el proyecto y hacer preguntas sobre decisiones técnicas.

## 4. Requisitos funcionales

### RF01 — Ver página de inicio

La aplicación debe mostrar una página inicial con descripción del ecommerce y accesos al catálogo y carrito.

### RF02 — Ver catálogo

La aplicación debe mostrar productos desde datos simulados en `src/data/products.js`.

### RF03 — Agregar producto al carrito

El usuario debe poder agregar productos desde el catálogo al carrito.

### RF04 — Ver contador de carrito

La navegación debe mostrar la cantidad total de productos agregados al carrito.

### RF05 — Ver carrito

El usuario debe poder revisar productos agregados, cantidades, subtotales y total.

### RF06 — Modificar carrito

El usuario debe poder aumentar, disminuir, eliminar productos y limpiar el carrito.

### RF07 — Persistir carrito

El carrito debe mantenerse en `localStorage` al recargar la aplicación.

### RF08 — Finalizar compra

El usuario debe poder ir al checkout e ingresar datos de cliente.

### RF09 — Validar datos del cliente

El checkout debe validar nombre, correo, teléfono y dirección antes de crear una orden.

### RF10 — Mostrar compra exitosa

Si la orden se crea correctamente, la aplicación debe mostrar una página de éxito con resumen de compra.

### RF11 — Mostrar compra fallida

Si ocurre un error controlado al crear la orden, la aplicación debe mostrar una página de fallo y conservar el carrito.

### RF12 — Navegación pública

La aplicación debe permitir navegar entre inicio, catálogo, carrito, login, registro y perfil mediante React Router.

### RF13 — Login/registro/perfil simulados

Las páginas de login, registro y perfil deben existir como interfaz frontend. No deben presentarse como autenticación real.

## 5. Requisitos no funcionales

### RNF01 — Responsividad

La interfaz debe adaptarse a distintos tamaños de pantalla usando Bootstrap/React-Bootstrap.

### RNF02 — Mantenibilidad

El código debe organizarse en componentes, páginas, hooks, contexto, utilidades y datos simulados.

### RNF03 — Testabilidad

La lógica de cálculos, validaciones, storage y checkout debe mantenerse en funciones o módulos testeables.

### RNF04 — Accesibilidad básica

Los formularios y botones críticos deben usar etiquetas, roles y atributos adecuados cuando sea necesario.

### RNF05 — Ejecución local

El proyecto debe instalarse con `npm install`, ejecutarse con `npm run dev`, probarse con `npm run test -- --run` y compilarse con `npm run build`.

## 6. Arquitectura frontend

```txt
React + Vite
  ├─ React Router: navegación
  ├─ React-Bootstrap: interfaz responsiva
  ├─ CartProvider/useCart: estado global del carrito
  ├─ utils/: reglas puras de negocio
  ├─ localStorage: persistencia local del carrito
  └─ Vitest + Testing Library: pruebas
 ```

 7. Decisiones técnicas relevantes

 ### React Router

 Se reemplazó la navegación temporal por estado local en App.jsx por rutas declarativas con React Router.

 ### Contexto de carrito

 El estado del carrito vive en CartProvider y se consume con useCart() para evitar duplicar estado en componentes.

 ### Vitest

 Se usa Vitest por recomendación docente y por integración natural con Vite.

 ### Login/registro simulados

 No se almacenan usuarios reales porque la aplicación no cuenta con backend ni base de datos. Presentar estas vistas como simuladas evita confundir maqueta
 frontend con autenticación real.

 8. Criterios de aceptación

 Antes de entrega:

 - npm run test -- --run debe pasar.
 - npm run build debe pasar.
 - El carrito debe persistir al recargar.
 - El flujo catálogo → carrito → checkout → éxito debe funcionar.
 - La navegación pública debe mostrar las páginas principales.
 - La documentación debe explicar limitaciones y decisiones técnicas.
