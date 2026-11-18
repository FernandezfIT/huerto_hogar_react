# EV3 — contratos compartidos A/B/C

> **Cierre interno: 25/11/2026. Entrega docente por confirmar.** Estas interfaces permiten trabajar en paralelo. No renombrarlas ni sustituirlas unilateralmente.

## 1. Estructura y base técnica

Conservar frontend raíz, datos/recursos históricos y lock. Un backend complementario en `backend/`, paquete `cl.huertohogar.backend`:

```text
backend/
  pom.xml, mvnw, mvnw.cmd, .mvn/wrapper/
  src/main/java/cl/huertohogar/backend/
    catalogo/       # A
    usuarios/       # C
    security/       # C
    shared/         # C
    config/         # C
  src/main/resources/db/migration/
  src/test/
src/services/       # C: cliente/auth/usuarios; A: productService
src/context/        # A: catálogo; B: identidad y carrito
src/hooks/          # useCatalog A; useAuth/useCart B
```

Java21/Boot4.0.9/Maven Wrapper/MySQL8.4; C comprueba resolución/compilación. No copiar otro proyecto, generar otro React, actualizar lock masivamente o agregar Docker/Compose/Testcontainers. H2 no acredita MySQL.

Flyway administra esquema; Hibernate validate. BDdev/test separadas y propias, credenciales externas. Reservas nuevas: A `V1__catalogo.sql`, `V2__semilla_catalogo.sql`; C `V3__usuarios_roles.sql`. Si existen migraciones aplicadas al implementar, revisar y acordar nuevas versiones, nunca sobrescribirlas. Sin DROP/clean/reset automático.

## 2. Tablas y semillas

### Catálogo — A

- `categorias`: id String, nombre, descripcion.
- `productos`: id String, categoria_id FK, nombre, descripcion, precio, precio_oferta nullable, stock, unidad, origen, imagen.
- CLP enteros positivos: Java BigDecimal y MySQL DECIMAL(19,0). Oferta positiva menor a precio o NULL; stock entero no negativo. No compra/descuento.
- Conservar FR001/FR002/FR003/VR001/VR002/VR003/PO001 y datos/recursos existentes; sin inventar productos.
- Categorías frescas/organicas/organicos/lacteos; sembrar cuatro, filtrar la vacía en UI según productos.
- Semillas una sola vez; reinicio no duplica ni restaura datos. Sin CRUD, uploads o versiones de inventario.

### Usuarios/roles — C

- `roles`: id Long y nombre único ADMIN/CLIENTE/INVITADO.
- `usuarios`: id Long generado, username único, password_hash y rol_id FK. Un rol por cuenta.
- Cuentas demo Admin/Cliente. **Sin cuenta Invitado**: la fila INVITADO es catálogo de roles y etiqueta del visitante anónimo, no autenticación ni usuario por cada GET.
- Esquema/roles mediante migración. Cuentas mediante inicializador restringido al perfil demo que lee credenciales externas, aplica PasswordEncoder y crea solo cuentas ausentes.
- Nunca contraseñas claras en SQL, reset al reiniciar, claves predeterminadas en código o datos personales reales. Sin registro/CRUD/edición de roles.

## 3. API exacta

Prefijo único `/api/v1`. JSON UTF-8.

| Método y ruta | Acceso | Respuesta |
|---|---|---|
| GET `/productos` | Público también para autenticados |200 array por id |
| GET `/productos/{id}` | Público |200 DTO;404 inexistente |
| GET `/categorias` | Público |200 array de metadatos |
| POST `/auth/login` | Público |200 token/identidad;400 JSON inválido;401 credenciales incorrectas |
| GET `/usuarios/me` | ADMIN o CLIENTE con JWT |200 identidad;401 sin JWT válido |
| GET `/usuarios` | Solo ADMIN; lista propuesta |200 array seguro;401 anónimo;403 Cliente |

No POSTproductos, PUT/DELETEusuarios, POSTpedidos, CSRF, refresh o logout de servidor. Denegar operaciones fuera del contrato; no permitAll general a toda la API.

### DTO de producto

```json
{
  "id": "FR001",
  "nombre": "Manzanas Fuji",
  "descripcion": "Descripción conservada desde la semilla existente",
  "categoriaId": "frescas",
  "categoria": "Frutas Frescas",
  "precio": 1200,
  "precioOferta": 990,
  "stock": 150,
  "unidad": "kilo",
  "origen": "Valle del Maule",
  "imagen": "/images/manzanas.jpeg"
}
```

Sin oferta: `precioOferta:null` explícito. A adapta a undefined/propiedad ausente para helpers que lo requieran. Precio JSON numérico, no string formateado. DTOcategoría: `{id,nombre,descripcion}`. No entidades JPA recursivas.

### Login e identidad

Entrada JSON: `{"username":"cuenta-demo","password":"valor-ingresado"}`. Rol/id del servidor, nunca del selector/body/storage del cliente. Usuario inexistente y clave incorrecta no deben revelar diferencias útiles de identidad.

```json
{
  "accessToken": "JWT_FIRMADO",
  "tokenType": "Bearer",
  "expiresIn": 1800,
  "usuario": {"id": 1, "username": "cuenta-demo", "rol": "ADMIN"}
}
```

`/usuarios/me` devuelve `{id,username,rol}`; `/usuarios` array de esa forma, ordenado por id. Sin password/password_hash/secretos ni tokens de otros usuarios. La lista es propuesta mínima de lectura para demostrar permisos, no CRUD ni exigencia docente acreditada.

Errores: `{"codigo":"NO_AUTENTICADO","mensaje":"Debes iniciar sesión."}`. Estados 400/401/403/404/500 según petición/autenticación/permiso/recurso/fallo; sin SQL o stacktrace. Los filtros Security también responden JSON, no redirects HTML.

## 4. JWT y autorización

- PasswordEncoder adaptativo compatible con hashes, p.ej. BCrypt; AuthenticationManager verifica contra BD. No comparación de claves claras, cifrado reversible o SHA simple.
- JwtEncoder/NimbusJwtEncoder emite; Resource Server/JwtDecoder valida. No filtro JWT casero o servidor OAuth externo.
- HS256 exclusivamente. Clave aleatoria externa de al menos 32 bytes, formato Base64 y longitud decodificada validada. No confundir longitud de contraseña humana con bytes aleatorios.
- Claims: sub=username canónico; iat; exp obligatorio con vida30min; iss=`huerto-hogar-local`; aud=`huerto-hogar-web`; roles=array ADMIN o CLIENTE.
- Verificar firma/algoritmo/tiempos/issuer/audience, exigir exp y documentar tolerancia temporal. Rechazar none u otros algoritmos. Prueba de expiración suficientemente anterior a la tolerancia.
- Mapear roles a ROLE_ADMIN/ROLE_CLIENTE explícitamente, no SCOPE_. /me deriva principal validado y consulta cuenta BD para salida.
- API stateless sin sesión/cookie auth/formLogin/Basic. Credenciales solo en Authorization: Bearer. Bajo estas condiciones se desactiva CSRF; stateless/JWT por sí solos no bastan si se agregan cookies credenciales.
- Catálogo permitAll, no anonymous-only. GETusuarios solo Admin aunque Cliente fuerce URL.
- Token React en memoria, nunca localStorage/sessionStorage/URL/cookie. Recarga pierde login; pedirlo otra vez. Sin refresh.
- Logout local borra identidad/token; no revoca copias externas, válidas hasta exp. No prometer revocación inmediata por borrar token del navegador.

## 5. Interfaces de frontend

C entrega exports nombrados siguientes; no crear wrappers paralelos.

### `src/services/tokenStore.js` — C

- `getAccessToken()` → string o null.
- `setAccessToken(token)` → guarda string no vacío en memoria.
- `clearAccessToken()` → deja null.
- `subscribeAuthInvalidated(callback)` → devuelve desuscripción.
- `invalidateAuth()` → borra token y notifica suscriptores; C ante401 protegido, B mediante logout.

Una única copia autoritativa del JWT aquí. AuthProvider conserva identidad/estado, no otra copia independiente del token. Sin persistencia.

### `src/services/httpClient.js` — C

`request(path,{method='GET',body,signal,auth=false}={})`:
- path comienza `/` y se une a `/api/v1`; ejemplo request('/productos').
- body objeto se serializa JSON; sin body en GET. signal llega a fetch; credentials omit.
- auth=true requiere token y añade Bearer. Si falta, lanzar ApiError401 sin inventarlo.401 protegido invalida auth;401 login público no renueva ni reenvía automáticamente.
- Verificar response.ok y JSON;204 devuelve undefined. Normalizar errores HTTP/red/protocolo; conservar AbortError. Sin reintentos automáticos.
- Export `ApiError` con status(number o0), codigo, message y kind('http'/'network'/'protocol').403 no borra Cliente válido.

### Servicios

| Archivo/dueño | Exports y resultado |
|---|---|
| productService.js / A |getProducts({signal}={})→array normalizado; getProduct(id,{signal}={})→producto; getCategories({signal}={})→array |
| authService.js / C |login(username,password)→usuario, tras validar respuesta/guardar token; getMe()→usuario autenticado; logout()→invalidateAuth local |
| userService.js / C |getUsers({signal}={})→array seguro, auth=true |

Respuesta de login parcial o inválida: limpiar token y lanzar error de protocolo; no aceptar identidad sin token/rol permitido.

### Providers y hooks

- A entrega export nombrado `CatalogProvider` en src/context/CatalogProvider.jsx y `useCatalog` en src/hooks/useCatalog.js.
- useCatalog devuelve `{products,categories,status,error,reload}`. status='loading'/'success'/'error'. Success con array vacío es vacío real; error no debe fingir stock agotado. reload consulta otra vez API.
- B entrega AuthProvider/RequireAdmin y useAuth con `{user,status,login,logout}`. status='anonymous'/'loading'/'authenticated'. Inicio sin token es anonymous; no restaurar identidad de storage.
- B monta BrowserRouter → AuthProvider → CatalogProvider → CartProvider → rutas. A no edita App en paralelo. CartProvider consume useCatalog y reconcilia solo status=success, nunca por API caída.
- /perfil solo identidad de /me; /admin/usuarios solo Admin. Invitado va a login; Cliente recibe acceso denegado. Guard visual no sustituye servidor.

## 6. Carrito exacto

- Producto por id, una fila. Cantidad entera positiva, máximo stock visible. Stock0 no entra; aumentar no excede stock.
- Conservar interacción: disminuir cantidad1 elimina fila; también quitar por id.
- Total derivado de oferta válida o precio y cantidad, no estado duplicado.
- Storage conserva clave `huerto-hogar-cart`; lectura try/catch y validación de líneas/IDs/cantidades. Descartar líneas inválidas, nunca credenciales/direcciones.
- Tras catálogo exitoso: quitar inexistentes/agotados, ajustar cantidad, refrescar precios/datos y avisar. No reconciliar como vacío ante fallo de carga.
- Compartido por navegador, no por cuenta. Login/logout no necesita borrar carrito. Sin sincronización BD, reserva ni descuento.
- Mostrar total orientativo y «Compra no implementada en esta entrega». Sin pedido/éxito simulado.

## 7. Arranque y configuración

- Spring127.0.0.1:8080; Vite127.0.0.1:5173 y proxy `/api` sin borrar prefijo. Verificar puertos libres y documentar cambios acordados; no detener servicios ajenos.
- Fetch relativo y hostname coherente, sin mezclar localhost/127.0.0.1. Proxy evita CORS general. Si se cambia a comunicación cruzada directa, origen exacto y sin cookies credenciales; no wildcard preventivo.
- MySQL local y BD propias propuestas huerto_hogar_dev/huerto_hogar_test después de comprobar disponibilidad.
- Variables documentadas sin valores: DB_URL, DB_USER, DB_PASSWORD, JWT_SECRET_BASE64, DEMO_ADMIN_USERNAME, DEMO_ADMIN_PASSWORD, DEMO_CLIENT_USERNAME, DEMO_CLIENT_PASSWORD. Tests con su BD y cuentas ficticias.
- .env no se supone cargado por Spring; dar comandos por shell sin imprimir secretos. JWT_SECRET nunca VITE_.
- HTTP solo loopback con datos demo, sin LAN/túneles. No equivale al TLS de Bearer en producción.
- Instrucciones para procesos separados y Windows/Linux revisados; registrar SO realmente probado. Sin instaladores automáticos, Docker, OpenAPI o JAR integrado obligatorios.

## 8. Cambios del contrato

Antes de cambiar campo/firma/ruta/permisos: registrar motivo, productor, consumidores, migración y tests afectados; acordarlo con involucrados y actualizar documentación. No implementar pedidos/CRUD para satisfacer expectativas antiguas de EV2.
