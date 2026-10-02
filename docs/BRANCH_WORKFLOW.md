# Flujo de ramas y colaboración

## Objetivo

Evitar el desorden del repositorio anterior y permitir que cada integrante trabaje en una parte clara del ecommerce.

## Ramas base

### `main`

Rama estable para entrega.

Reglas:

- No trabajar directo sobre `main`.
- Solo se integra código probado.
- Debe estar siempre en estado presentable.

### `develop`

Rama de integración del equipo.

Reglas:

- Las ramas `feature/...` nacen desde `develop`.
- Los Pull Requests deben apuntar a `develop`.
- Cuando `develop` esté estable, se integra a `main`.

## Ramas de feature

Crear una rama por área de trabajo:

```txt
feature/catalog-products-data
feature/cart-checkout-flow
feature/navigation-layout-public-pages
feature/testing-docs-coverage
```

## Comandos guía

> Estos comandos debe ejecutarlos el integrante responsable. Pi no ejecutará comandos Git.

Crear `develop` desde `main`:

```bash
git checkout main
git pull
git checkout -b develop
git push -u origin develop
```

Crear una feature desde `develop`:

```bash
git checkout develop
git pull
git checkout -b feature/nombre-de-la-rama
git push -u origin feature/nombre-de-la-rama
```

Actualizar una feature con cambios recientes de `develop`:

```bash
git checkout feature/nombre-de-la-rama
git pull origin develop
```

Antes de pedir Pull Request:

```bash
npm run test -- --run
npm run build
```

Subir cambios:

```bash
git status
git add .
git commit -m "Descripción clara del cambio"
git push
```

## Checklist antes de Pull Request

- [ ] La app corre con `npm run dev`.
- [ ] Las pruebas pasan con `npm run test -- --run`.
- [ ] El build pasa con `npm run build`.
- [ ] No hay archivos temporales o basura.
- [ ] El código tiene nombres claros.
- [ ] La lógica no obvia tiene comentarios breves.
- [ ] La rama no toca archivos de otra rama sin coordinación.
- [ ] El integrante puede explicar qué hizo y por qué.

## Cómo reducir conflictos

- No editar todos `App.jsx` al mismo tiempo sin coordinar.
- Crear componentes separados por responsabilidad.
- Usar carpetas claras.
- Hacer commits pequeños.
- Actualizarse desde `develop` con frecuencia.
- Comunicar si se necesita modificar un archivo compartido.

## Archivos compartidos que requieren cuidado

- `src/App.jsx`
- `src/data/products.js`
- `README.md`
- archivos dentro de `docs/`
- configuración de testing o Vite

Si dos personas necesitan tocar el mismo archivo, coordinar antes.
