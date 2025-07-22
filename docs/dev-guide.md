# Guía de Desarrollo – Proyecto de Inventario

Este documento sirve como guía rápida para cualquier desarrollador que se incorpore al proyecto, proporcionando instrucciones claras sobre cómo configurar el entorno, trabajar con el flujo de ramas, mantener la estructura del proyecto y seguir buenas prácticas de desarrollo.

# 🧠 Estructura de ramas

El proyecto sigue un flujo de trabajo basado en Git Flow simplificado:

- master: Rama principal de producción. Todo lo que está aquí está en producción.

- developer: Rama de integración. Se mezclan aquí los cambios listos antes de ir a producción.

- feature/[nombre] o [nombre-participante]: Ramas de trabajo. Crea una rama por cada funcionalidad o módulo que estés desarrollando.

# 📌 Buenas prácticas con ramas

- Siempre crea tu rama desde developer.

- Nombra tus ramas de manera clara (feature/exportacion-excel, john/variant-handler).

- Al finalizar tu tarea, haz un pull request (PR) hacia developer.

- Asegúrate de mergear frecuentemente developer en tu rama para evitar conflictos.

# ⚙️ Instalación y setup
## 1. Requisitos

- Node.js (v18+)

- npm

- Supabase CLI instalado globalmente

- Docker

```bash
npm install -g supabase
```

o si vienes de windows o tienes problemas:

```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

Para esto es necesario tener instalado [Scoop](https://scoop.sh/).

## 2. Instalar dependencias

En la raíz del proyecto:

```bash
npm install
```

## 3. Setup de Supabase local

El proyecto usa Supabase de forma local para desarrollo y pruebas. Navega a la carpeta supabase Allí encontrarás un README.md con instrucciones específicas de configuración. Para iniciar Supabase con la configuración existente:

```bash
supabase start
```

Este comando usará la configuración del archivo supabase/config.toml.

>[!NOTE]
>Si es la primera vez que ejecutas el comando, se empezará a descargar los contenedores de supabase, lo cual puede consumir mucho espacio en disco, alrededor de 10GB.

Una vez no necesites de tener supabase local, puedes ejecutar el comando `supabase stop` para detenerlo, liberará el espacio de memoria.

Y para más información sobre el uso de supabase local, puedes consultar la [documentación oficial](https://supabase.com/docs/guides/cli/local).


## 4. Migraciones y Seeds

Desde la carpeta supabase, para aplicar la estructura de base de datos y datos iniciales:

```bash
supabase db reset
```

Es importante que revises también la [documentación local](/supabase/README.md), para que facilite el flujo de trabajo o requieras hacer cambios en el backend.

Esto limpia, migra y aplica los seeds definidos.

# ✅ Checklist antes de subir cambios

- Ejecutaste `npm run lint` y pasó correctamente.

- Agregaste pruebas para tu código.

- Respetaste la arquitectura hexagonal.

- Documentaste nuevos casos de uso si corresponde (docs/).

- Comprobaste que tu funcionalidad funciona con Supabase local.
