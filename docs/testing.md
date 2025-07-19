# 🧪 Plan de Testing de Khipu

Este documento detalla las estrategias y herramientas de pruebas utilizadas para garantizar la calidad, estabilidad y seguridad del sistema Khipu.

---

## 📦 1. Pruebas Unitarias

**Objetivo**: Verificar la lógica de negocio de manera aislada en funciones, clases y casos de uso.

**Herramienta**: [Vitest](https://vitest.dev/)

**Ámbitos a cubrir**:
- Casos de uso en `core/use-cases`
- Implementación de los repositorios `infrastructure/repositories`
- Utilidades en `infrastructure/shared`
- Utilidades en `core/shared`
- Rutas de la API en `app/api`


**Ejemplos esperados**:
- Verificar que al mover un ítem de inventario a otro grupo se actualice correctamente la entidad.
- Confirmar que una función de filtrado devuelva los resultados esperados según los criterios.

**Código de ejemplo**:
```typescript
import { test, expect } from 'vitest'
import { withTestTransaction } from 'infrastructure/shared'
import { PostgresInventoryRepository } from 'infrastructure/repositories'

test('should move an item to another group', async () => {
  const catalogItemRepository= new PostgresCatalogItemRepository();
  const expectedCatalogItem : CatalogItem = {
      id: '32220013',
      name: 'SILLA'
  };
  const result = await catalogItemRepository.get(expectedCatalogItem.id);

  expect(result).toBeDefined();
  expect(result!.id).toBe(expectedCatalogItem.id);
  expect(result!.name).toBe(expectedCatalogItem.name);

  const badResult = await catalogItemRepository.get('465456465465465');

  expect(badResult).toBeNull();
})
```

>[!NOTE]
> Se debe de agregar un beforeAll con el siguiente código para que los logs se autorefrequen cada vez que se ejecute el test y se vea reflejado en la carpeta `.logs`.

```typescript
beforeAll(async () => await deleteLogs());
```

---

## 🔁 2. Pruebas de Integración

**Objetivo**: Validar que múltiples partes del sistema funcionen correctamente en conjunto, especialmente la comunicación entre API y Supabase (DB, autenticación, almacenamiento).

**Herramientas**:
- Vitest
- Función de `withTestTransaction` en `infrastructure/shared`

**Ejemplos esperados**:
- Repositorios implementados en `infrastructure`
- Comunicación con base de datos y servicios de archivos/autenticación
- Correcto retorno de datos en caso de error
- Que un usuario autenticado pueda crear un censo en un periodo y que los datos se reflejen en la base.
- Que al subir un documento se asocie correctamente con su periodo y metadatos.

---

## 🔒 3. Pruebas de Seguridad

**Objetivo**: Detectar vulnerabilidades comunes como inyecciones SQL, XSS, CSRF o accesos indebidos.

**Posibles Herramientas**:
- [ZAP (Zed Attack Proxy)](https://www.zaproxy.org/)
- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)
- Tests personalizados con Vitest para simular inyecciones

**Ejemplos esperados**:
- Campos que puedan permitir SQL Injection (como filtros dinámicos o búsqueda avanzada)
- Formularios susceptibles a XSS persistente o reflejado
- Endpoints protegidos por sesión evaluados contra ataques CSRF
- Subida de archivos que impida cargas peligrosas (ej. `.php`, `.sh`)
- Que los campos de texto no interpreten HTML malicioso.
- Que la protección CSRF esté activa en formularios importantes.

---

## 💥 4. Pruebas de Estrés y Carga

**Objetivo**: Evaluar el rendimiento del sistema bajo múltiples usuarios y escenarios de carga intensiva.

**Herramientas sugeridas**:
- [k6](https://k6.io/)
- [Artillery](https://www.artillery.io/)
- [wrk](https://github.com/wg/wrk)

**Escenarios a simular**:
- Ingresar simultáneamente múltiples ítems de inventario
- Cargar archivos masivos o documentos pesados
- Consultar el dashboard con filtros combinados y muchos registros

**Indicadores para ser medidos**:
- Tiempo de respuesta promedio
- Porcentaje de errores (timeouts, 500s)
- Consumo de memoria/CPU durante pruebas

---

## ✅ 5. Pruebas de Aceptación con Usuarios Reales

TODO

---

## 📁 Organización

- tests
- ├── unit
- │ └── repositories
- │ ├── api
- │ └── shared
- ├── integration
- │ ├── integration-test.ts
- ├── security
- │ └── sql-injection.test.ts
- ├── stress
- │ └── inventory-load-test.ts

---

## 📝 Tareas a hacer

- [ ] Crear fixtures y base de datos para entorno de testing
- [ ] Escribir primeros test unitarios de casos de uso existentes
- [ ] Definir escenarios concretos para pruebas de carga
- [ ] Reclutar usuarios para pruebas de aceptación
