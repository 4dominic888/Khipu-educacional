# ⚙️ Supabase local

Este directorio contiene los archivos de configuración y migraciones de Supabase para desarrollo local.

## 🛠 Estructura

- `migrations/`: Migraciones SQL versionadas
- `seed.sql`: Datos por defecto en la base de datos
- `config.toml`: Configuración del entorno
- `functions/`: Funciones Edge (si aplica)

## 🧪 Setup

- Iniciar entorno local:
```bash
supabase start
```

>[!NOTE]
> Las URLs y claves de Supabase se generarán automáticamente al ejecutar el comando anterior, crea un archivo en la raiz del proyecto llamado `.env` con la siguiente estructura:

```bash
API_URL=http://x.x.x.x:54321
GRAPHQL_URL=http://x.x.x.x:54321/graphql/v1
S3_STORAGE_URL=http://x.x.x.x:54321/storage/v1/s3
DB_URL=postgresql://postgres:postgres@x.x.x.x:54322/postgres
STUDIO_URL=http://x.x.x.x:54323
INBUCKET_URL=http://x.x.x.x:54324
NEXT_API_URL=http://localhost:3000 # Esto no esta en las claves generadas por Supabase

JWT_SECRET=super-secret-jwt-token-with-at-least-32-characters-long
ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SERVICE_ROLE_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
S3_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
S3_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
S3_REGION=local
```

La interfaz de Supabase se accede en la URL llamada STUDIO_URL.

## 🧪 Comandos útiles

- Resetear la base de datos en base a los archivos de migración y la seed:
```bash
supabase db reset
```

- Crear una migración vacia:
```bash
supabase migration new NAME
```

- Crea una migración en base al schema en la carpeta `schemas`, cabe aclarar que se usa una convención para los nombres basado en cual se debe ejecutar primero y despues, ademas de tenerlos ordenados en `supabase/config.toml`, sin embargo esto no es suficiente por el momento, por lo que en caso exista un error, se debe corregir manualmente en el archivo de migración generado:
```bash
supabase db diff -f NAME
```

- Generar tipado de los modelos de la BD para typescript:
```bash
supabase gen types typescript --local > infrastructure/shared/supabase.types.ts
```

o mediante npm:
```bash
npm run gen-types
```