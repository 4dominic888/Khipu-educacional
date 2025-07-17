# 🗄️ Especificación de Base de Datos — Khipu

Este documento describe la estructura actual de la base de datos del sistema **Khipu**, incluyendo tablas, relaciones, vistas, triggers y procedimientos relevantes.

Para ver el diagrama de entidad relación, se puede consultar en Supabase Studio.

---

## 📚 Esquema General

- Motor: PostgreSQL
- Extensiones usadas: `pgcrypto` (para UUIDs aleatorios)
- Dominio: Gestión de bienes inmuebles educativos
- Convención: Todas las tablas están en el esquema `public`

---

## 🧩 Tablas Principales

### 🕒 `period_time`
Almacena los periodos que organizan el sistema (pueden ser anuales u otro criterio definido por el usuario).

| Columna     | Tipo   | Restricciones         |
|-------------|--------|------------------------|
| id          | UUID   | PK, generado automáticamente |
| name        | text   | único, no nulo         |
| description | text   | opcional               |

---

### 📦 `catalog_item`
Lista oficial de ítems institucionales. No puede ser modificada por usuarios finales.

| Columna | Tipo | Restricciones         |
|---------|------|------------------------|
| id      | text | PK, formato tipo código (e.g. `32220013`) |
| name    | text | único, no nulo         |

---

### 🗂 `inventory_group`
Agrupa ítems por espacios físicos (ej. aulas, cocinas), separados por periodo.

| Columna     | Tipo  | Restricciones                             |
|-------------|-------|--------------------------------------------|
| id          | UUID  | PK                                        |
| name        | text  | No nulo                                   |
| description | text  | Opcional                                  |
| period      | UUID  | FK → `period_time(id)` — ON DELETE CASCADE |
| updated_at  | timestamp | Se actualiza automáticamente en cada cambio |
| 🔒 Unique   | `(name, period)` → permite nombres repetidos entre periodos |

---

### 📋 `inventory_item`
Representa un ítem del catálogo dentro de un grupo.

| Columna           | Tipo  | Restricciones                          |
|-------------------|-------|-----------------------------------------|
| id                | UUID  | PK                                     |
| group_id          | UUID  | FK → `inventory_group(id)`             |
| catalog_item_id   | text  | FK → `catalog_item(id)`                |
| total             | int   | >= 0 (se calcula automáticamente)       |
| updated_at        | timestamp | Autoactualizable                     |

---

### 📑 `acquisition`
Información sobre el documento de adquisición asociado a cada variante.

| Columna  | Tipo     | Restricciones                                    |
|----------|----------|---------------------------------------------------|
| id       | UUID     | PK                                               |
| type     | text     | `'Recibo'`, `'Boleta'`, `'Donación'`            |
| number   | text     | No nulo                                          |
| date     | date     | No nulo                                          |
| price    | numeric(12,2) | >= 0                                      |

---

### 🧬 `variant_inventory_item`
Variaciones detalladas de un `inventory_item`. Aquí se reflejan diferencias físicas, estado y adquisición.

| Columna              | Tipo      | Restricciones                                         |
|----------------------|-----------|--------------------------------------------------------|
| id                   | UUID      | PK                                                   |
| inventory_item_id    | UUID      | FK → `inventory_item(id)` — ON DELETE CASCADE        |
| color                | text      | No nulo                                               |
| length, width, height| numeric(6,3) | ≥ 0 (medidas en metros)                            |
| serial_number        | text      | Opcional                                              |
| brand, model         | text      | Opcional                                              |
| caracteristic        | text      | Descripción opcional breve                           |
| conservation_status  | text      | `'Bueno'`, `'Regular'`, `'Malo'`                     |
| acquisition_id       | UUID      | FK → `acquisition(id)`                               |
| notes                | text      | Opcional                                              |
| images               | text[]    | Arreglo de rutas de imágenes                         |
| count                | int       | > 0 (cantidad de esa variante)                       |
| updated_at           | timestamp | Autoactualizable                                     |

---

## 🔍 Vistas

### 📄 `inventory_item_summary`

Resumen por ítem para dashboards o listados.

| Campo             | Fuente                 |
|------------------|------------------------|
| id               | `inventory_item.id`    |
| total            | `inventory_item.total` |
| catalog_item_id  | `catalog_item.id`      |
| catalog_item_name| `catalog_item.name`    |

---

### 📊 `inventory_group_info`

Resumen de cada grupo con total acumulado de ítems.

| Campo        | Fuente                |
|--------------|-----------------------|
| id           | `inventory_group.id`  |
| name         | `inventory_group.name`|
| description  | `inventory_group.description` |
| count        | Suma de `inventory_item.total`|

---

## ⚙️ Triggers y Funciones

### ⏱ `updated_at`

Actualiza la columna `updated_at` automáticamente al modificar:

- `inventory_item`
- `variant_inventory_item`
- `inventory_group`

---

### 🧾 Auditoría de Variantes

Audita cambios `INSERT` y `UPDATE` sobre `variant_inventory_item`.

**Tabla**: `variant_inventory_item_audit`

| Campo        | Descripción                |
|--------------|----------------------------|
| operation    | `'INSERT'` o `'UPDATE'`    |
| old_data     | JSONB del estado anterior  |
| new_data     | JSONB del nuevo estado     |
| changed_at   | Timestamp automático        |

**Trigger**: `trg_audit_variant_inventory_item`

---

### 🔄 Recuento Automático

Después de cada `INSERT`, `UPDATE` o `DELETE` sobre `variant_inventory_item`, se actualiza automáticamente el campo `inventory_item.total`.

**Trigger**: `trg_update_total_after_*`  
**Función**: `update_inventory_total()`

---

## 🧪 Procedimientos

### `register_acquisition_with_items(acquisition_id, inventory_items: jsonb)`

Permite insertar varios `inventory_item` asociados a una adquisición con un solo llamado.

**Parámetros**:
- `in_acquisition_id`: UUID de adquisición creada previamente
- `in_inventory_items`: array de objetos JSON con estructura:
```json
{
  "id": "uuid",
  "group_id": "uuid",
  "catalog_item_id": "text",
  "total": 12
}
