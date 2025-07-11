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
> Las URLs y claves de Supabase se generarán automáticamente al ejecutar el comando anterior, crea un archivo dentro de la carpeta `supabase` llamado `.env` con la siguiente estructura:

```bash
API_URL=http://x.x.x.x:54321
GRAPHQL_URL=http://x.x.x.x:54321/graphql/v1
S3_STORAGE_URL=http://x.x.x.x:54321/storage/v1/s3
DB_URL=postgresql://postgres:postgres@x.x.x.x:54322/postgres
STUDIO_URL=http://x.x.x.x:54323
INBUCKET_URL=http://x.x.x.x:54324

JWT_SECRET=super-secret-jwt-token-with-at-least-32-characters-long
ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SERVICE_ROLE_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
S3_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
S3_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
S3_REGION=local
```

La interfaz de Supabase se accede en la URL llamada STUDIO_URL.

## 🧪 Comandos útiles

- Resetear la base de datos:
```bash
supabase db reset
```

- Crear una migración vacia:
```bash
supabase migration new NAME
```

- Generar tipado de los modelos de la BD para typescript:
```bash
supabase gen types typescript --local > types/supabase.types.ts
```