# EV3 — alcance esencial y planificación del equipo

> **CIERRE INTERNO: 25 de noviembre de 2026.** Las tres rutas deben estar integradas, comprobadas y documentadas para esa fecha. La fecha y hora de entrega docente siguen por confirmar; no confundir este cierre interno con una fecha oficial.

Esta carpeta es la referencia de trabajo para la EV3 de **Huerto Hogar**. Los documentos anteriores de EV2 se conservan como antecedentes y no definen el alcance vigente.

## Orden de lectura

1. [Coordinación general](COORDINACION.md): alcance, reparto, dependencias, hitos y entrega.
2. [Contratos compartidos](CONTRATOS.md): datos, API, permisos e interfaces que ninguna ruta debe cambiar por su cuenta.
3. Leer la guía de la ruta asignada:
   - [Ruta A — catálogo y datos](RUTA-A-CATALOGO.md).
   - [Ruta B — carrito e interfaz de perfiles](RUTA-B-CARRITO-INTERFAZ.md).
   - [Ruta C — backend, usuarios y JWT](RUTA-C-BACKEND-JWT.md).
4. [Pruebas y aceptación](PRUEBAS.md): quince casos prioritarios y checklist de entrega.

## Resultado esperado

- Reutilizar el React existente, sin construir otra tienda.
- Catálogo/categorías/ficha/ofertas consumiendo Spring Boot y MySQL.
- Carrito local: agregar, ajustar cantidades, quitar, calcular total y conservar al recargar.
- Login JWT obligatorio con cuentas Admin y Cliente almacenadas en MySQL.
- Roles ADMIN, CLIENTE e INVITADO en BD; **Invitado navega sin cuenta ni token**.
- Sin CRUD de usuarios. Se propone una lista de usuarios de solo lectura para Admin como demostración mínima de permisos; confirmar este detalle al asignar tareas.
- Sin pedidos, checkout, pagos, correos ni descuento de stock.
- Arranque local con React, Spring y MySQL nativos; sin nube ni contenedores.

## Para integrantes que usen un agente

Entregar al agente los contratos, esta coordinación y **solo la ruta asignada**. Pedir cambios por tarea, no generar la aplicación completa. El agente debe inspeccionar el repositorio, reutilizar lo existente y declarar cualquier desviación antes de implementarla. Un código generado o una prueba mockeada no acreditan integración real.

Cada integrante responde por sus cambios, sus pruebas y su explicación. No incorporar funciones adicionales porque una herramienta las genere rápidamente.

## Estado de este paquete

Documentación preparada en la rama `docs`, desde la base local `main` / `091b78c`. La inspección que originó el paquete encontró frontend, carrito, datos JS y checkout simulado; no encontró un directorio backend. No se consultó el estado remoto ni se ejecutaron pruebas de la aplicación durante esta preparación documental.

Este paquete **no significa que el backend o las funcionalidades propuestas ya existan**. Los responsables, la capacidad real del equipo y la fecha docente deben confirmarse. La lista Admin de lectura y la entrega con procesos separados son detalles de la propuesta, no requisitos docentes acreditados.
