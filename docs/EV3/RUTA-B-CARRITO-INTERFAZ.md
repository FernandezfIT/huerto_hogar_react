# Ruta B — carrito e interfaz de perfiles

> **Cierre interno: 25/11/2026.** Preparar carrito sin esperar JWT; objetivo de recorrido integrado el 22/11 y revisión el 24/11. Fecha docente por confirmar.

Leer [coordinación](COORDINACION.md), [contratos](CONTRATOS.md) y [pruebas](PRUEBAS.md). Esta ruta sustituye pedidos: no hay checkout real ni orderService.

## Entregable y propiedad

Carrito reutilizado, login visual real, identidad de Cliente/Admin, Invitado sin cuenta y navegación coherente. Lista de usuarios solo lectura para Admin propuesta: confirmar este detalle al asignar tareas.

**Archivos propios:** CartProvider/cartContext/useCart, cálculos/storage del carrito, CartPage/CartSummary y sus tests; AuthProvider/useAuth/RequireAdmin; LoginPage, ProfilePage de identidad y página Admin; `src/App.jsx`, `src/components/AppNavbar.jsx` y sus tests.

No editar seguridad/SQL/HTTP de C ni fuente/vistas de A sin coordinación. No otro frontend o segundo contexto de carrito.

## B1 — conservar carrito y cerrar reglas

1. Leer reducer de CartProvider, API de useCart, cálculos y storage. Ya existe agregar/aumentar/disminuir/quitar/vaciar; reutilizar.
2. Una fila por id. Agregar repetido incrementa sin superar stock; stock0 no se agrega. Cantidades enteras positivas, sin NaN/fracciones o strings sin validar.
3. Conservar interacción: disminuir cantidad1 elimina fila; también eliminación directa. No cambiarla por preferencia del agente.
4. Total y cantidad derivados, no estados duplicados. Oferta válida prevalece sobre precio normal.
5. Mantener clave `huerto-hogar-cart`. Validar array y cada línea al restaurar; parseo roto no rompe render. Sin token/identidad en storage.
6. Reconciliar con useCatalog de A solo cuando status=success: quitar inexistentes/agotados, ajustar cantidades al stock y actualizar datos/precios. Avisar ajustes al usuario.
7. No vaciar por loading/error de API. Carrito local de navegador, no de cuenta; no reserva/descuenta stock BD.
8. T03/T04/T05 prueban consolidación, límite y persistencia. Reusar pruebas existentes equivalentes, sin duplicar por cantidad.

**Aceptación:** carrito correcto primero con fixtures contractuales y después con productos API (E03). Total orientativo, sin número de pedido/pago ficticio.

## B2 — conectar autenticación visual

1. Reutilizar LoginPage para username/password. Sin selector de rol que otorgue permisos, comparación de claves en frontend o login falso.
2. C entrega authService/tokenStore/suscripción (E04/E05). B crea AuthProvider/useAuth con esas interfaces, no otro JWT persistido.
3. Sin token inicial: user=null/status=anonymous y etiqueta Invitado. No crear visitante BD o emitir token anónimo.
4. Durante login mostrar loading y bloquear envío repetido. Esperar authService.login; éxito guarda identidad, error no inventa usuario. No almacenar/imprimir contraseña.
5. Identidad viene de BD y /me confirma principal. ProfilePage queda solo lectura; sin formulario editable ni datos personales falsos.
6. Recarga completa pierde token y vuelve a Invitado/login sin alterar carrito. No restaurar usuario desde localStorage para aparentar sesión.
7. 401 protegido limpia identidad mediante suscripción de C; 403 muestra acceso denegado sin cerrar sesión Cliente válida. Fallos de catálogo no redirigen a login.
8. Logout usa authService.logout local y borra identidad, no endpoint inexistente. No prometer revocación de copias externas.
9. T15 comprueba que la siguiente petición no conserva Bearer. Verificar manualmente error de login, expiración y recarga.

**Aceptación:** Admin/Cliente autentican contra BD, no solo mocks; Invitado usa catálogo/carrito sin login.

## B3 — lista Admin de lectura propuesta

Confirmar antes de empezar. Si se excluye, registrar impacto en demostración de permisos y ajustar T13/T14 con el equipo; no sustituirla por CRUD.

1. Crear `src/pages/admin/AdminUsersPage.jsx`, export default. Usar getUsers de C (E06), no Fetch paralelo.
2. Tabla username/rol; id opcional en UI. Sin hashes/claves ni botones crear/editar/eliminar.
3. RequireAdmin utiliza identidad de AuthProvider para navegación; C aplica autorización verdadera.
4. Invitado va a login; Cliente ve acceso denegado; Admin carga tabla. Manejar vacío/loading/error; 403 no invalida Cliente.
5. Verificar con C que Cliente no obtiene datos manipulando URL o estado React. El servidor devuelve403; ocultar link no basta.
6. C escribe T13/T14 de servidor; B verifica integración visual sin duplicar toda la suite.

## B4 — providers, rutas y retirada de compra

B es editor coordinado de App/navbar. A/C entregan exports y requisitos; no editar simultáneamente.

1. Composición: BrowserRouter → AuthProvider → CatalogProvider(A) → CartProvider → AppRoutes. Adaptar envolturas de tests aislados que necesiten providers.
2. Conservar `/`, `/catalogo`, `/categorias`, `/ofertas`, `/producto/:id`, `/carrito`, `/login` y `/perfil` solo identidad. Agregar `/admin/usuarios` si se confirma la propuesta.
3. Mantener adaptador `idDelProducto` o coordinar cambio con A; no renombrar interfaz aisladamente.
4. Retirar rutas operativas `/checkout`, `/compra-exitosa`, `/compra-fallida` y `/registro`. Acceso directo lleva a aviso/ruta segura, nunca abre el flujo simulado.
5. Retirar imports/estado/handlers de orden innecesarios en App y enlaces/callbacks de checkout de CartPage/navbar/Home u otros consumidores. Conservar código histórico aislado si conviene; no borrado masivo sin razón.
6. Carrito muestra «Compra no implementada en esta entrega» y total orientativo. Ningún botón anuncia pedido/pago/correo real.
7. Navbar muestra carrito/identidad, login para Invitado, logout para autenticados y lista Admin solo para Admin. Sin registro/perfil editable.
8. Adaptar tests de navegación al alcance nuevo justificando expectativas; no implementar pedidos para satisfacer un test obsoleto de EV2.

## B5 — regresión, evidencia y cierre

- Invitado: catálogo→detalle→agregar→ajustar→quitar→recargar, sin JWT ni escrituras BD.
- Cliente: login→identidad→carrito; acceso Admin denegado; logout vuelve a Invitado y conserva carrito.
- Admin: login→identidad→lista segura→logout sin Bearer.
- Probar URLs antiguas directamente además de botones/navbar.
- Ejecutar T03/T04/T05/T15, regresión relevante y build/lint integrados; registrar resultados reales.
- Documentar comportamiento de storage/login/recarga y ausencia de compra.
- Revisar GET de A y explicar click→reducer→render frente login→API→token→identidad. Hacer una corrección pequeña comprobable.

## Topes de B

| Falta | Adelantar | No acreditar todavía |
|---|---|---|
| E03 API A | Reducer/storage con fixtures | Carrito con datos MySQL |
| E04 HTTP/authService | Formulario/promesas controladas | Login HTTP real |
| E05 JWT/me | UI de identidad | Cuenta BD autenticada |
| E06 lista Admin | Tabla con fixture | Permiso real Admin |
| E07 provider A | Componentes aislados | App integrada |

## Checklist B — previo al 25/11

- [ ] Carrito conserva interacciones y valida límites/storage.
- [ ] Reconciliación solo con carga exitosa y aviso de ajustes.
- [ ] Token solo en memoria C, identidad sincronizada y logout local efectivo.
- [ ] Invitado sin cuenta y Cliente sin acceso Admin.
- [ ] Lista propuesta ratificada, sin hashes/CRUD.
- [ ] App/navbar/providers coordinados, sin compra/registro simulados operativos.
- [ ] Pruebas, documentación y revisión cruzada registradas.

## Instrucción reutilizable para agente de Ruta B

> Lee docs/EV3/COORDINACION.md, CONTRATOS.md, PRUEBAS.md y esta guía; inspecciona código antes de editar. Implementa solo la tarea B asignada, reutilizando CartProvider/componentes. No pedidos, registro, CRUDusuarios o JWT propio. Respeta servicios/providers acordados y propiedad de A/C. Informa archivos, diff, pruebas reales y bloqueos Exx. Git e instalaciones requieren autorización específica. Cierre interno 25/11/2026: un mock no equivale a integración terminada.
