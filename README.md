# TP Arquitectura Web 📡

**Proyecto para la materia Arquitectura Web - Implementado una API REST en NODE JS con Bun**

Este proyecto fue desarrollado en base al "Curso Node Intensivo" del educador Alan Buscaglia (Gentleman Programming en youtube).

[Curso Node Intensivo](https://www.youtube.com/watch?v=z4x1OGfJkek&t=186s)

## Acerca de las tecnologías usadas

ESLint va a analizar estáticamente el código para encontrar problemas

Configurado con las reglas de "Airbnb javascript style guide"

[Airbnb JS Style Guide](https://github.com/airbnb/javascript)

Validación con Valibot (creador de schemas)

Los schemas se usan para poder restringir y establecer como debe ser un objeto

Esto es fundamental tanto para el backend como para el front, por ejemplo en formularios como React Hook Forms donde se puede utilizar un "schema resolver" para poder validar el formulario directamente sin tener que hacerlo de forma manual

Uso Valibot en vez de Zod (otro creador de schemas muy usado) porque es más moderno, sencillo y rápido

La principal diferencia es que tiene un diseño modular de su API y tiene la habilidad de reducir el bundle size al mínimo usando tree shaking y code splitting (esto último fue visto en clase)

Comparado con Zod, y dependiendo del schema, el bundle size se reduce en un 95%

Bcrypt para encriptar / desencriptar

Cors para dar la posibilidad de que la app se ejecute entre diferentes dominios

Jsonwebtoken para manejo de tokens


Instalar dependencias:

```bash
bun install
```

Ejecutar:

```bash
bun run index.ts
```

Este proyecto fue creado usando `bun init` en bun v1.2.15. [Bun](https://bun.sh) es un Javascript runtime todo en uno.
