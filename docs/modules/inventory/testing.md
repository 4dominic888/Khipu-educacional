# Requerimientos Fundamentales para Testing

Este documento define los lineamientos y requerimientos mínimos para escribir pruebas usando **Vitest**, que cubren los repositorios de datos (`catalog`, `group`, `inventoryItems`, `variantInventoryItems`) y sus endpoints API correspondientes. El objetivo es garantizar cobertura completa y confiable para pruebas unitarias e integradas.

---

## 🎯 Objetivos del Testing

- Validar comportamiento esperado de funciones y métodos individuales (unit testing).
- Asegurar la integración entre capas (repositorio ↔ base de datos, API ↔ servicio).
- Proteger contra regresiones.
- Verificar reglas de negocio y consistencia de datos.
- Validar restricciones impuestas por relaciones (FK, cascadas, uniqueness, etc.).

---

## 🧱 Estructura de Descripciones (`describe` / `it`)

Las pruebas deben estar organizadas por módulo y entidad:
No se debe de repetir validaciones si otros test ya lo abordan.

- tests
- ├── unit
- │ └── repositories
- │ ├──     ├── catalog.spec.ts
- │ ├──     ├── group.spec.ts
- │ ├──     ├── inventory-item.spec.ts
- │ ├──     ├── inventory-item-variant.spec.ts
- │ ├── api
- │ ├──     ├── catalog.spec.ts
- │ ├──     ├── group.spec.ts
- │ ├──     ├── inventory-item.spec.ts
- │ ├──     ├── inventory-item-variant.spec.ts
- │ └── shared
- │ ├──     ├── db-utils.spec.ts

---

## 🧪 Requerimientos Específicos por Módulo

### 📦 Catalog Repository

- `getAll()` debe retornar todos los items del catálogo actual.
- Los filtros de búsqueda deben aplicarse a todos los campos del catálogo.
- No se puede crear ni modificar un item del catálogo desde la aplicación de forma manual.
- Se debe poder importar el catálogo desde un archivo Excel válido.
- Los IDs deben conservarse como strings (por ejemplo, `32220013`).
- Los cambios de nombre no deben romper relaciones existentes.

### 🗂 Group Repository

- Permite crear, listar, editar y eliminar grupos.
- Los filtros de búsqueda deben aplicarse a todos los campos del grupo.
- Los nombres pueden repetirse en diferentes periodos, pero no en el mismo.
- Al mover items de un grupo a otro, se debe mantener consistencia.
- Eliminar un grupo con items debe lanzar error o requerir confirmación explícita.
- Los items deben pertenecer a un solo grupo.

### 📋 Inventory Item Repository

- Crear un item debe estar basado en un item del catálogo existente.
- Los filtros de búsqueda deben aplicarse a todos los campos del item.
- No se puede crear un item con código no existente en el catálogo.
- Los items deben pertenecer a un solo grupo.
- Los items pueden repetirse entre grupos separados, pero no en mismos grupos.

### 🧬 Variant Inventory Item Repository

- Cada ítem puede tener múltiples variantes, con cantidades respectivas.
- Los filtros de búsqueda deben aplicarse a todos los campos de las variantes.
- Debe permitir duplicar o clonar una variante dentro o entre grupos.
- La suma de cantidades de variantes debe coincidir con el total para el item.
- Si se crea una variante con un ID no existente en el catálogo, se debe devolver un error.
- Si se crea una variante con valores iguales al de otra variante del mismo item, se debe devolver una advertencia.

---

## 🌐 API

- Los endpoints deben validar entradas:
  - Items sin código válido del catálogo deben ser rechazados.
  - Medidas no numéricas deben devolver `400`.
  - Estados de conservación fuera de valores válidos (`bueno`, `regular`, `malo`) deben dar error.
- La API debe devolver errores estructurados y claros.
- Todas las mutaciones (POST, PUT, DELETE) deben ser seguras, con rollback en errores.
- Validar paginación, filtros y búsquedas si aplica.

---

## 🔐 Validaciones de Seguridad (Opcional pero recomendado)

- Simular ataques de inyección SQL: valores maliciosos en `search`, `filter`, etc.
- Simular XSS en campos como `observaciones`, `marca`, `modelo`.
- Validar CSRF donde se requieran cookies o tokens.
- Rechazar cargas no válidas de archivos.

---

## 🧪 Criterios para Aceptar un Test como Completo

- Cubre al menos una ruta feliz y múltiples casos borde.
- Tiene al menos un test para entrada inválida por tipo o dominio.
- Evalúa restricciones de integridad si aplica.
- No deja datos persistentes al terminar (uso de transacciones o mocks).

---