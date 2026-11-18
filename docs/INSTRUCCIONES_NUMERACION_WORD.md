# Cómo dejar sin numeración la portada y el índice en Word

## Objetivo

```txt
Página 1: Portada en blanco → sin número
Página 2: Índice → sin número
Página 3 en adelante: contenido real → con número de página
```

## Pasos en Word

### 1. Crear salto de sección después del índice

Coloca el cursor al final del índice.

Luego:

```txt
Disposición / Layout
→ Saltos
→ Saltos de sección
→ Página siguiente
```

Debe quedar:

```txt
Sección 1: portada + índice
Sección 2: contenido real
```

### 2. Entrar al pie de página de la primera página de contenido

Haz doble click en el pie de página de la primera página real del informe.

Arriba debería aparecer algo como:

```txt
Pie de página - Sección 2
```

### 3. Desactivar “Vincular al anterior”

En la pestaña de encabezado/pie:

```txt
Vincular al anterior
```

Debe quedar desactivado.

Esto es clave: si no lo haces, al borrar números en portada/índice se borran también en el contenido.

### 4. Borrar números de portada e índice

Ve al pie de página de la portada o índice y borra el número.

Como ya desvinculaste la sección 2, eso no debería afectar las páginas con contenido.

### 5. Insertar numeración solo en la sección de contenido

En la primera página real del informe:

```txt
Insertar
→ Número de página
→ Final de página
→ Elige el formato
```

### 6. Opcional: empezar numeración desde 1

Si quieres que la primera página de contenido sea “1”:

```txt
Número de página
→ Formato del número de página
→ Iniciar en: 1
```

Si prefieres que conserve el número físico de página, no cambies esto.

## Recomendación

Para informe académico, usaría:

```txt
Portada: sin número
Índice: sin número
Primera página de contenido: página 1
```

Ese formato se ve más limpio.
