# EV3 — coordinación general

> **Cierre interno: 25/11/2026.** Para esa fecha la versión debe poder arrancarse siguiendo las instrucciones y demostrarse completa. Entrega docente: fecha y hora todavía por confirmar. No planificar funciones nuevas suponiendo que habrá plazo hasta diciembre.

## 1. Alcance que debe respetar todo el equipo

### Incluido

1. Mantener frontend raíz, React/Vite/Bootstrap, componentes y diseño existentes.
2. Agregar un único backend compartido en `backend/`: Java21, Spring Boot4.0.9, Maven Wrapper, JPA, Validation, MySQL8.4 y Flyway. Verificar la resolución real de dependencias antes de afirmar que funciona; no cambiar versiones por iniciativa aislada.
3. Catálogo público de lectura desde MySQL: productos, categorías, detalle y ofertas. Búsqueda/filtros locales sobre esos datos.
4. Reutilizar carrito con estado React y localStorage; cantidades enteras, límites de stock visible y total derivado.
5. Cuentas demo Admin/Cliente persistidas y login JWT real. Roles ADMIN/CLIENTE/INVITADO persistidos; Invitado anónimo sin usuario/token.
6. Identidad visible según autenticación. Propuesta de lista de usuarios de solo lectura para Admin para demostrar autorización; no edición de usuarios.
7. Arranque local con procesos React/Spring y MySQL nativo, documentación y pruebas.

### Fuera: NO desarrollar

- CRUD de usuarios, productos o categorías.
- Registro público, perfil editable, recuperación de claves, edición de roles, refresh tokens.
- Pedidos, checkout, comprobantes, pagos, correos, despacho e historial de compras.
- Descuento/reserva de stock, bloqueos de compra, idempotencia y concurrencia de pedidos.
- Dashboard, rediseño, subida de archivos, nueva tienda, paginación.
- Nube, Docker/Compose/Testcontainers, CI nueva, OpenAPI y JAR con frontend integrado obligatorios.

No es correcto dejar operativas las pantallas antiguas y anunciar una compra o registro exitoso. B retirará el acceso a esos flujos; no hace falta borrar todo su código histórico.

## 2. Reparto de responsabilidades

| Ruta | Dueño por asignar | Entregable | No le corresponde |
|---|---|---|---|
| A | Pendiente | SQL/modelo/API de catálogo y cuatro vistas públicas conectadas | Seguridad, carrito, CRUD o pedidos |
| B | Pendiente | Carrito, login visual, identidad, lista Admin, App/navbar y retirada de compra simulada | JWT criptográfico, consultas de usuarios BD, migraciones de C |
| C | Pendiente | Backend común, Flyway, usuarios/roles, JWT, permisos, HTTP y arranque | Rehacer vistas de A/B o escribir todos sus tests |

**Cada ruta entrega implementación, pruebas de su dominio, documentación de sus cambios y revisión de otra ruta.** C coordina las interfaces backend, pero no es el único integrador ni responsable de reparar silenciosamente todo.

### Antes de asignar

- Confirmar responsable A/B/C y suplente para revisión.
- Confirmar lista Admin de lectura: es una propuesta pequeña para distinguir permisos, no un CRUD ni requisito docente verificado.
- Confirmar entrega con procesos separados, sin paquete JAR+SPA obligatorio.
- Revisar avances reales de cada copia antes de estimar lo pendiente.
- Confirmar la fecha docente cuando se conozca y avisar cualquier conflicto con el cierre25/11.

## 3. Punto de partida observado

En la base local revisada existen `src/context/CartProvider.jsx`, `src/hooks/useCart.js`, `src/utils/cartStorage.js`, componentes de carrito, catálogo y páginas de checkout/resultado. `src/App.jsx` todavía monta checkout, registro y perfil simulados.

`src/utils/catalog.js` importa datos JS por defecto; por eso cambiar únicamente CatalogPage no alcanza. A debe retirar dependencias estáticas de producción también de helpers/categorías/ficha/ofertas. `precioOferta` actualmente se evalúa contra `undefined`: adaptar el `null` de la API.

Se conserva el comportamiento actual de disminuir cantidad1: elimina la fila. No se cambia la interacción por preferencia de un agente.

No hay backend observado en esta base. Si una copia del equipo ya lo tiene, identificar su procedencia y compatibilidad antes de generar uno nuevo. La rama documental no demuestra actualización con GitHub ni pruebas aprobadas actuales.

## 4. Secuencia y calendario interno

Las fechas siguientes son **objetivos internos de integración**; se validan con responsables y avances reales. No son una garantía de velocidad de implementación ni fechas oficiales del docente.

| Hito | Objetivo | Condición observable |
|---|---|---|
| G0 — base y contratos | 18/11 | A/B/C leen contratos; base backend compilable y reservas SQL acordadas |
| G1 — lectura e identidad inicial | 20/11 | Catálogo real desde navegador y primer login contra BD; no solo mocks |
| G2 — recorrido integrado | 22/11 | Carrito desde catálogo real, ambos logins, identidad y permisos Admin/Cliente |
| G3 — verificación | 24/11 | Casos prioritarios y regresión ejecutados, README seguido por otro integrante |
| G4 — cierre interno | **25/11** | Solo corregir defectos críticos, consolidar evidencia y ensayar entrega |

Si un hito no se cumple, informar en cuanto se detecte y ajustar reparto/alcance con el equipo. No ocultar un bloqueo porque se espere que un agente lo resolverá al final. No quitar controles de seguridad o borrar tests para cumplir una fecha.

## 5. Cuadro de dependencias

| ID | Quién entrega y qué | Quién lo necesita | Puede avanzar mientras falta | Cómo se libera |
|---|---|---|---|---|
| E01 | C: scaffold, paquetes y errores comunes | A: entidades/API; C: seguridad | A SQL/fixtures; B carrito/UI | PR base compilable con contrato respetado |
| E02 | A: V1/V2; C: Flyway/BDtest/V3 | A/C: persistencia | SQL y pruebas de reglas | Migración real en MySQLtest y reinicio sin duplicación |
| E03 | A: GETproductos/categorías y fuente de catálogo | B: carrito con datos reales | Carrito con fixtures contractuales | Navegador obtiene datos MySQL sin fallback JS |
| E04 | C: request/authService/tokenStore | A: servicios; B: login/UI | Hooks/formularios con promesas controladas | Interfaces disponibles e integración HTTP real |
| E05 | C: login JWT y /me | B: autenticación/identidad | Pantalla y estados de error | Admin/Cliente se autentican contra BD y decoder real |
| E06 | C: GETusuarios soloAdmin | B: lista de lectura | Tabla con fixture sin datos sensibles | Admin200, Cliente403, anónimo401 comprobados |
| E07 | A: CatalogProvider; B: AuthProvider/exports | B: composición App/navbar | Componentes aislados | Navegación integrada sin imports inexistentes |
| E08 | A/B/C: evidencia y documentación | Cierre conjunto | Documentar lo ya probado | Recorrido completo y checks registrados |

B no necesita JWT para mejorar carrito. C no necesita las cards para desarrollar login. A no necesita login para GET públicos. No hay dependencia de stock transaccional ni pedidos.

## 6. Propiedad de archivos compartidos

- A: `backend/.../catalogo`, V1/V2, `productService`, `CatalogProvider`/`useCatalog`, helpers y páginas públicas de catálogo.
- B: `CartProvider`/carrito/storage, componentes auth de UI, páginaAdmin, `src/App.jsx`, `src/components/AppNavbar.jsx` y sus tests.
- C: `backend/pom.xml`, Wrapper/config/security/shared/usuarios, V3, clienteHTTP/tokenStore/authService/userService, `vite.config.js` y documentación de arranque.
- `package.json`/lock: cualquier cambio requiere acuerdo; C coordina una sola edición. No actualizar dependencias masivamente.
- Cada ruta agrega su evidencia a la matriz de pruebas; una sola persona consolida el archivo al cierre para evitar conflictos.
- A entrega exports/requisitos a B; no edita App simultáneamente. B solicita cambios de HTTP a C; no crea otro cliente.

Las rutas de archivos nuevos son destinos de implementación; no afirmar que ya existen.

## 7. Forma de trabajar y uso de agentes

1. Convertir cada tarea A1/B1/C1, etc. en tarjeta con dueño, archivos, contrato y prueba.
2. Antes de editar, inspeccionar archivos existentes y estado de la copia. No generar de cero lo ya resuelto.
3. Crear cambios pequeños por tarea en la rama de implementación que el equipo acuerde. `docs` es solo documentación; no programar ahí. El equipo decide su integración Git, sin reescribir ramas ajenas.
4. No cambiar endpoints, campos, firmas, migraciones aplicadas o permisos sin registrar impacto y avisar a consumidores.
5. Estados: Pendiente → En curso → Preparado con fake → Integrado real → Verificado → Hecho. Bloqueado debe indicar Exx y entrega faltante.
6. «Preparado con fake» no acredita MySQL ni seguridad. No presentar pantallas aisladas como integración terminada.
7. Usar IA por tarea y dentro de archivos asignados. Prohibido pedirle tres aplicaciones distintas o aceptar funciones extra para “completar” el sistema.
8. Toda entrega del agente debe indicar archivos modificados, comandos ejecutados, resultados observados y pendientes. No inventar evidencia.
9. El integrante revisa el diff y explica su código antes de solicitar revisión. No confiar en que compiló solo porque el agente lo escribió.

### Si hay bloqueo

Registrar tarjeta, proveedor, entrega faltante, consumidor y prueba pendiente. Avisar al detectar el bloqueo. Elegir una tarea adelantable del cuadro. Si amenaza la fecha, reasignar una subtarea completa con archivos y criterio de aceptación; no duplicar el módulo del otro integrante.

## 8. Criterio de cierre del 25/11

- [ ] Rutas A/B/C con responsables y revisión cruzada.
- [ ] Catálogo procede de MySQL y no de fixtures productivos.
- [ ] Carrito completo y persistente, sin generar pedidos ni modificar stock BD.
- [ ] Admin/Cliente autentican contra BD y JWT; Invitado navega sin cuenta.
- [ ] Permisos servidor comprobados, sin hashes/secretos en respuestas.
- [ ] ListaAdmin de lectura ratificada y conectada, o decisión de excluirla registrada con impacto en demostración de roles.
- [ ] Sin accesos activos a registro/checkout/perfil editable simulados.
- [ ] Casos de [PRUEBAS.md](PRUEBAS.md), regresión existente, build/lint y compilación registrados.
- [ ] Otro integrante sigue instrucciones de arranque desde una copia preparada y BD dedicada.
- [ ] README distingue requisitos, lo probado y lo pendiente por SO.
- [ ] Cada integrante explica su recorrido y una corrección pequeña.
- [ ] Fecha/hora docente y medio de entrega confirmados cuando estén disponibles.

No se declara cloud realizado, dispensa académica escrita ni cobertura exhaustiva de seguridad. El material de repaso y la instrucción transmitida por Felipe orientan el recorte; una nueva rúbrica debe revisarse sin reintroducir extras automáticamente.
