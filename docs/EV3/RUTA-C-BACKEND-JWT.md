# Ruta C — backend, usuarios BD y JWT

> **Cierre interno: 25/11/2026.** Objetivos intermedios: base compartida el 18/11, primer login contra BD el 20/11, permisos e integración el 22/11 y pruebas de arranque el 24/11. Fecha docente por confirmar.

Leer [coordinación](COORDINACION.md), [contratos](CONTRATOS.md) y [pruebas](PRUEBAS.md). JWT es obligatorio. No implementar la antigua sesión con cookie y CSRF ni agregar refresh tokens.

## Entregable y propiedad

Entregar backend compartido, MySQL/Flyway, cuentas y roles persistidos, login JWT, autorización, cliente HTTP común e instrucciones de arranque. No desarrollar todas las vistas, pruebas y documentación de los demás.

**Archivos propios:** `backend/pom.xml`, Wrapper, paquetes config/shared/security/usuarios y sus tests; `V3__usuarios_roles.sql` si la reserva sigue libre; HTTPclient/tokenStore/authService/userService; proxy Vite; instrucciones de ejecución. A administra catálogo/V1/V2 y B App/navbar/authUI/carrito.

## C1 — verificar entorno y entregar scaffold

1. Inspeccionar la copia actual y cualquier backend creado por compañeros. No generar otro si existe uno compatible.
2. Registrar Java, Node/npm, servidor MySQL nativo, puertos y sistema operativo realmente usados. Tener el cliente mysql no acredita que el servidor esté listo.
3. Preparar `backend/`, paquete `cl.huertohogar.backend` y Maven Wrapper completo. Mantener Java21/Boot4.0.9 según contrato; comprobar resolución y compilación antes de declarar compatibilidad. No modificar el frontend ni su lock para crear el backend.
4. Dependencias gestionadas por Boot: MVC, JPA, Validation, MySQL, Security, Resource Server, JOSE y tests; integración Flyway compatible y soporte MySQL. No copiar versiones transitivas de ejemplos antiguos ni Springfox.
5. Variables externas, perfiles demo/test y escucha en loopback. Verificar disponibilidad antes de usar puertos o nombres de BD; no detener servicios ajenos.
6. Crear errores compartidos y respuestas JSON. Entregar scaffold compilable a A (E01) antes de terminar toda la autenticación.
7. No agregar OpenAPI, JAR con SPA ni infraestructura adicional: no son parte del mínimo.

**Aceptación:** base común compilable y destinos claros para A. Un pom escrito no acredita compilación; registrar comando y resultado.

## C2 — Flyway, BDdev/test y semillas

1. Preparar BD y usuario propios para desarrollo y pruebas. Configurar DB_URL/DB_USER/DB_PASSWORD externamente; nunca secretos en el repositorio.
2. Flyway será el único mecanismo de esquema; Hibernate usa validate. A aporta V1/V2; C revisa tipos/FK y aporta V3 para usuarios/roles.
3. Confirmar versiones libres. No editar migraciones aplicadas, usar DROP/clean/reset ni reutilizar una BD de otro trabajo.
4. Crear roles ADMIN/CLIENTE/INVITADO y usuarios con username único y FK a un rol.
5. Crear cuentas demo solo para Admin y Cliente mediante inicializador restringido al perfil demo. Leer credenciales externas, usar PasswordEncoder adaptativo y crear únicamente cuentas ausentes. No claves claras en SQL ni reset de contraseñas al reiniciar.
6. No crear cuenta Invitado, visitante persistido o usuario por cada GET.
7. Aplicar migraciones en MySQLtest nativo; verificar tablas, semillas y restricciones. Un segundo arranque no debe duplicar datos. A verifica su catálogo.
8. Entregar configuración y comandos de pruebas a A. La limpieza se limita a datos de BDtest; nunca dev. H2 o mocks no acreditan MySQL.

**Aceptación E02:** esquema real compatible y cuentas con hash. Las credenciales no se publican en la documentación.

## C3 — login contra BD y emisión JWT

1. Implementar repositorio/UserDetailsService o adaptador equivalente que consulte usuarios BD. AuthenticationManager verifica credenciales usando PasswordEncoder.
2. Login JSON exacto del contrato. Rol e identidad vienen del servidor, no de campos adicionales enviados por React. Usuario inexistente y contraseña incorrecta devuelven 401 sin token/hash.
3. Usar JwtEncoder/NimbusJwtEncoder y Resource Server/JwtDecoder. No filtro JWT artesanal ni servidor OAuth externo.
4. Fijar HS256 y clave aleatoria externa de al menos 32 bytes. Documentar formato Base64 y validar longitud decodificada; no contraseña humana o variable VITE_.
5. Emitir sub/iat/exp/iss/aud/roles según contrato. Exigir exp con vida de 30 minutos y validar firma, algoritmo, tiempos, issuer y audience. Documentar tolerancia temporal.
6. Convertir roles explícitamente a ROLE_ADMIN/ROLE_CLIENTE. JWT firmado no es cifrado: no incluir claves o datos privados.
7. Ejecutar T06/T07/T08 con BD y encoder/decoder reales. Un token hardcodeado o un helper jwt() que omite criptografía no demuestran esta integración.

**Aceptación E05 inicial:** ambos usuarios autentican contra BD y reciben JWT verificable. Sin registro, CRUD o refresh.

## C4 — permisos de servidor y errores

1. GET de catálogo/detalle/categorías públicos también para autenticados; POST de login público. No permitAll general a toda la API.
2. `/usuarios/me` requiere JWT. Derivar principal validado y consultar cuenta BD para la respuesta segura; no aceptar identidad desde React.
3. GET `/usuarios` solo para Admin si se confirma la lista propuesta. Devolver id/username/rol, nunca hash/secretos. Cliente recibe 403 y anónimo 401.
4. Proteger por método/ruta y denegar operaciones fuera del contrato. No crear escrituras de productos o usuarios por comodidad.
5. Configuración stateless sin formLogin, Basic, sesión o cookie de autenticación. Bearer solo en header. Desactivar CSRF bajo esas condiciones; si se incorporan cookies credenciales hay que revisar la decisión.
6. EntryPoint y AccessDeniedHandler responden JSON, no redirects HTML. ControllerAdvice no cubre todos los filtros; no exponer SQL/stacktrace.
7. Ejecutar T09–T14 atravesando filtros/decoder reales. Token alterado o expirado debe rechazarse aunque React muestre una identidad antigua.

**Aceptación E06:** autorización real comprobable, no solamente un guard visual.

## C5 — interfaces compartidas de frontend

1. Entregar tokenStore en memoria con get/set/clear/subscribe/invalidate según contrato. Sin localStorage, sessionStorage o cookies.
2. Entregar request/ApiError: prefijo relativo /api/v1, JSON/204/error/red/protocolo/cancelación, credentials omit y Bearer solo para auth=true.
3. Un 401 protegido invalida autenticación; un 403 no borra una sesión Cliente válida. No reintentos automáticos, JWT por URL o body en GET.
4. authService.login guarda token únicamente después de validar la respuesta y devuelve identidad; getMe requiere auth; logout invalida localmente sin endpoint artificial.
5. userService.getUsers consume el GET protegido. Entregar interfaces a B antes del acabado visual; A consume el mismo cliente HTTP.
6. B conecta AuthProvider y RequireAdmin. C no modifica App en paralelo. Verificar juntos login/logout y diferencias entre 401 y 403.
7. Proxy Vite `/api` hacia Spring sin borrar el prefijo. Mantener hostname coherente y loopback. No abrir CORS general para esconder un error de configuración.

**Aceptación E04/E05/E06:** interfaces disponibles y verificadas contra API real. Si faltan vistas, mostrar peticiones reales, no inventar que la UI ya funciona.

## C6 — instrucciones de arranque y cierre

La documentación de ejecución producida durante la implementación debe permitir a otro integrante:

1. Consultar requisitos y versiones realmente probadas, crear BDdev/test propias y configurar usuario dedicado.
2. Configurar variables del contrato sin valores reales; generar la clave aleatoria Base64 y exportarla en su shell. No asumir que Spring carga .env automáticamente.
3. Compilar, probar y arrancar backend con Wrapper y perfil correcto. Incluir equivalentes Windows/Linux y marcar qué sistema se probó realmente.
4. Arrancar frontend mediante npm y comprobar proxy/puertos. No instalar servicios automáticamente.
5. Verificar catálogo, ambos logins, permisos, carrito y reinicio; sin nube ni contenedores.
6. Ejecutar tests en BDtest sin destruir dev y registrar resultados observados.
7. Comprender que logout no revoca copias del token y recarga pierde autenticación. HTTP en loopback con datos ficticios no demuestra seguridad TLS de producción.

C consolida evidencia aportada por A/B, no la inventa ni absorbe todos sus tests. Antes del 25/11, otro integrante debe seguir las instrucciones y registrar el resultado. En el cierre solo se reparan defectos críticos, sin nuevas funciones.

## Checklist C — previo al 25/11

- [ ] Base compila y Flyway/MySQLdev/test son coherentes, sin servicios ajenos afectados.
- [ ] Roles BD y dos cuentas con hash; Invitado anónimo sin cuenta/token.
- [ ] Firma, exp, algoritmo, issuer, audience y roles correctos; sin secretos en repo.
- [ ] /me protegido y lista Admin propuesta autorizada en servidor.
- [ ] Interfaces HTTP/memoria entregadas e integración con B verificada.
- [ ] T06–T14 registrados y arranque seguido por un compañero.
- [ ] Explicación credenciales→BD/hash→JWT→decoder→permiso y revisión cruzada.

## Instrucción reutilizable para agente de Ruta C

> Lee docs/EV3/COORDINACION.md, CONTRATOS.md, PRUEBAS.md y esta guía. Inspecciona el estado actual e implementa únicamente la tarea C asignada. Reutiliza el backend existente si corresponde; no otro frontend, CRUD, pedidos, sesión cookie, refresh o filtro JWT casero. No alteres datos/servicios ajenos, migraciones aplicadas ni contratos sin coordinación. Mantén secretos externos y autorización de servidor. Entrega diff, comandos, resultados reales y bloqueos. Git e instalaciones requieren autorización específica. Cierre interno 25/11/2026: no desactives controles para aparentar finalización.
