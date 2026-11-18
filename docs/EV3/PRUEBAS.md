# EV3 — pruebas prioritarias y aceptación

> **Cierre interno: 25/11/2026.** Completar la verificación antes del cierre; objetivo de primera ejecución integrada: 24/11. Fecha docente por confirmar.

## 1. Política

- Planificar un máximo de **15 tests nuevos prioritarios**, no 15 archivos ni reemplazar toda la suite anterior por 15.
- Antes de crear uno, buscar cobertura equivalente existente. Si ya cubre exactamente el objetivo, adaptarlo/reutilizarlo y registrar su ruta; no duplicarlo para llegar a una cifra.
- Los quince casos de la tabla son el inventario de aceptación. Algunos podrán estar cubiertos por tests existentes: no es obligatorio agregar quince definiciones si ya hay cobertura.
- No borrar tests útiles, omitir suites o relajar expectativas para aparentar éxito. Si cambió el alcance de checkout/registro, actualizar expectativas de navegación justificadamente; no construir pedidos para satisfacer el alcance antiguo.
- Un mock permite probar UI, no acreditar persistencia MySQL, firma JWT o autorización real.
- Esta selección prioriza riesgos; no equivale a una auditoría exhaustiva de seguridad ni fija un porcentaje de cobertura académico.

## 2. Quince casos concretos

Los identificadores T01–T15 se usan en las rutas y PR. Cada fila requiere un resultado observable, no solo confirmar llamadas a una función.

| ID | Preparación y acción | Resultado exigido | Responsable / nivel |
|---|---|---|---|
| T01 | MySQLtest migrado; consultar GETproductos con un producto conocido | ID/precio/oferta de BD correctos, respuesta200 sin fallbackJS | A / integración BD+HTTP |
| T02 | Simular fallo de GET al cargar catálogo | Error visible, no productos ficticios ni mensaje de catálogo vacío | A / React+HTTP controlado |
| T03 | Agregar dos veces FR001 con stock suficiente | Una fila, cantidad2 y total correcto usando oferta si corresponde | B / reducer o componente |
| T04 | Producto con stock1; intentar segundo incremento | Cantidad permanece1 | B / reducer o componente |
| T05 | Guardar carrito, desmontar y montar de nuevo con mismo storage | Ítems/cantidades restaurados | B / React+localStorage |
| T06 | CuentaAdmin en MySQLtest y credenciales válidas; POSTlogin |200, JWT verificable y rolADMIN desdeBD | C / BD+encoder/decoder reales |
| T07 | CuentaCliente en MySQLtest y credenciales válidas; POSTlogin |200, JWT verificable y rolCLIENTE desdeBD | C / BD+encoder/decoder reales |
| T08 | Contraseña incorrecta en POSTlogin |401, sin accessToken ni hash | C / seguridad+HTTP |
| T09 | JWT válido deCliente en GETusuarios/me |200 con identidad del principal validado, no elegida porReact | C / decoder real+HTTP |
| T10 | Alterar JWT y llamar /me |401, sin identidad protegida | C / decoder real |
| T11 | JWT firmado con exp anterior a la tolerancia configurada; llamar /me |401 por expiración | C / decoder real |
| T12 | Llamar /me sin Authorization |401JSON, sin redirectHTML | C / seguridad+HTTP |
| T13 | Cliente llama GETusuarios aunque fuerce la ruta |403, sin lista ni hashes | C / autorización de servidor |
| T14 | Admin llama GETusuarios |200 array soloid/username/rol, sin passwords/hashes | C / BD+seguridad+HTTP |
| T15 | Autenticar UI, hacer logout e intentar petición protegida |Token/identidad eliminados; no se envíaBearer antiguo; vuelve a login | B / React+cliente compartido |

T13/T14 dependen de ratificar la lista Admin de lectura propuesta. Si se excluye, acordar cómo demostrar la diferencia real de permisos y actualizar tabla/contratos; no reemplazarlos por un CRUD improvisado ni marcar “aprobado” sin operación existente.

## 3. Preparación y ejecución

### Frontend

Usar Vitest/Testing Library existentes y los scripts actuales:

```bash
npm run test -- --run
npm run build
npm run lint
```

No ejecutar solo una selección dejando el resto roto y presentarlo como regresión completa. Pruebas asíncronas deben esperar la respuesta/render; desmontar entre casos y limpiar storage/datos controlados cuando corresponda.

### Backend

C documentará los comandos concretos al materializar el backend, usando Maven Wrapper del proyecto, perfiltest y BDtest nativa. Referencia de forma del comando, **no certificación de que exista ahora**:

```bash
cd backend
./mvnw test
```

En Windows usar `mvnw.cmd`. La configuración de prueba debe seleccionar BDtest explícitamente; no confiar en el valor de desarrollo. Si hay pruebas de integración separadas, C documenta también cómo ejecutarlas para que el comando de entrega no las omita.

Para T06–T11, atravesar encoder/decoder real; un helper jwt() que inserta una autenticación mock no acredita firma/exp. Para T01/T06/T07/T14 usar MySQL dedicado; H2/repositorymock no son evidencia equivalente. No dejar datos o credenciales reales en fixtures.

## 4. Checklist manual acotado

Estas comprobaciones acompañan la demo; no se cuentan como nuevos tests automatizados ni se consideran aprobadas por estar escritas.

- [ ] Carga, catálogo vacío real y error de API se distinguen.
- [ ] Oferta null no aparece como oferta100% ni rompe total.
- [ ] Categorías y búsqueda porURL conservadas; detalle inexistente controlado.
- [ ] Eliminar último ítem deja total0; disminuir cantidad1 quita lafila.
- [ ] Storage corrupto o forma inválida no rompe laapp.
- [ ] Catálogo actualizado reconcilia precio/stock e informa ajustes; APIcaída no borra carrito.
- [ ] Invitado navega sin cuenta/token; usuario autenticado conserva acceso al catálogo público.
- [ ] Anónimo no puede listar usuarios; Cliente no puede cambiar su rol alterandoUI/body.
- [ ] JWT sin exp o con algoritmo no permitido no autentica; secretos fuera de respuestas/repositorio.
- [ ] Refresh pierde login pero conserva carrito; logout no conservaBearer.
- [ ] Acceso directo a rutas viejas no abre checkout/registro/perfil editable simulado.
- [ ] Agregar/modificar carrito no crea pedidos ni descuenta stockBD.
- [ ] Segundo arranque no duplica semillas ni resetea cuentas/datos.
- [ ] Otro integrante sigue instrucciones de arranque y registraSO/puertos/versiones probados.

## 5. Evidencia que debe aportar cada ruta

En cada PR incluir:

1. Tareas y casosTxx cubiertos; archivo/test o comprobación manual exacta.
2. Contrato usado, archivos modificados y dependenciasExx liberadas o pendientes.
3. Comandos ejecutados y resultado observado; diferenciar “no ejecutado”, “falló” y “aprobado”.
4. Entorno: SO, versiones y uso de MySQLtest o mocks según el caso.
5. Defectos encontrados/corregidos y límites que todavía existen.

Plantilla de matriz que debe completarse durante implementación:

| Caso | Archivo/test o pasos | Entorno y tipo de evidencia | Resultado observado | Responsable |
|---|---|---|---|---|
| Txx | Pendiente | Pendiente | No ejecutado | Por asignar |

No reutilizar una cifra histórica de tests de EV2 como resultado actual. La preparación de estos documentos no ejecutó la aplicación ni acredita pruebas nuevas.

## 6. Aceptación integrada antes del25/11

Recorrido de demo: **Invitado → catálogoMySQL → carrito → loginCliente → identidad → accesoAdmin denegado → logout → loginAdmin → lista segura → logout**. La lista depende de su confirmación al asignar.

Cada integrante explica su parte, sigue una petición/actualización completa y realiza una corrección pequeña comprobable. La generación de código por un agente no sustituye revisión ni evidencia real. Cierre técnico requiere que la combinación integrada, no solo cada rama aislada, pase los checks y arranque según documentación.
