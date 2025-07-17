# 📋 Requerimientos del Sistema — Khipu

> Este documento especifica de forma general los requerimientos iniciales del sistema **Khipu**. Estos están sujetos a cambios conforme avance el desarrollo y se recopile feedback de los usuarios.

---

## Índice

- [1. Requerimientos Funcionales](#1-requerimientos-funcionales)
- [2. Requerimientos No Funcionales](#2-requerimientos-no-funcionales)
- [3. Requerimientos Técnicos](#3-requerimientos-técnicos)
- [4. Consideraciones de Seguridad](#4-consideraciones-de-seguridad)
- [5. Anexos](#5-anexos)

---

## 1. Requerimientos Funcionales

| ID    | Descripción                                                                 | Prioridad |
|-------|-----------------------------------------------------------------------------|-----------|
| RF-01 | El sistema debe guardar información limitada pero útil de la institución al comenzar a usarse | Alta |
| RF-02 | El sistema debe permitir a los usuarios autenticarse con y sin contraseña dependiendo de como se haya configurado el sistema | Alta |
| RF-03 | Los usuarios deben poder crear, editar y eliminar archivos dentro del servidor mediante una interfaz | Alta |
| RF-04 | Cada módulo debe separar su información por periodos definidos por el usuario (ej. años) | Alta |
| RF-05 | El sistema debe permitir gestionar bienes inmuebles mediante un inventario | Alta |
| RF-06 | Los usuarios deben poder generar censos institucionales                    | Alta     |
| RF-07 | El sistema debe permitir subir y acceder a archivos con permisos específicos por documento | Alta |
| RF-08 | Debe existir un dashboard resumen al estilo SonarQube con tarjetas por módulo y período | Media |
| RF-09 | El sistema debe permitir a los usuarios crear y editar planes y resoluciones | Alta |
| RF-10 | El sistema debe permitir a los usuarios habilitar o desahbilitar módulos a través de la sección de plugins | Alta |
| RF-11 | El sistema debe permitir exportar los archivos a formatos comunes que ellos manejen (ej. PDF, DOCX, XLSX) | Alta |

---

## 2. Requerimientos No Funcionales

| ID    | Descripción                                                                 | Prioridad |
|-------|-----------------------------------------------------------------------------|-----------|
| RNF-01| El sistema debe poder ejecutarse completamente en entornos autoalojados   | Alta      |
| RNF-02| El sistema debe estar optimizado para ejecutarse en hardware limitado no mayor a 4GB de RAM    | Alta      |
| RNF-03| Las respuestas de la API no deben exceder los 500ms bajo carga normal       | Media     |
| RNF-04| El sistema debe tener soporte offline para la mayoria de las funcionalidades principales | Alta   |
| RNF-05| El backend debe seguir una arquitectura hexagonal para mantener bajo acoplamiento | Alta  |
| RNF-06| El sistema debe ser compatible con diferentes navegadores web | Alta |
| RNF-07| El sistema debe ser seguro contra ataques XSS y CSRF | Alta |
| RNF-08| El sistema debe ser seguro contra ataques SQL | Alta |
| RNF-09| El sistema debe ser seguro o mitigar ataques DDOS | Alta |
| RNF-10| El sistema debe poseer una auditoría de acciones de usuarios | Alta |
| RNF-11| El sistema debe poder contener una sección de backups de datos | Media |
| RNF-12| El sistema necesita usar el protocolo HTTPS para todas las comunicaciones entre cliente y servidor | Media |
| RNF-13| El sistema al estar en producción, no debe tener Supabase Studio ni una instancia de Supabase de desarrollo | Alta |
| RNF-14| El sistema debe tener un sistema de actualizaciones automática y manual | Media |
| RNF-15| El sistema debe tener un sistema de notificaciones de cambios de estado | Media |

---

## 3. Requerimientos Técnicos

| ID    | Descripción                                                                 | Prioridad |
|-------|-----------------------------------------------------------------------------|-----------|
| RT-01 | El frontend debe usar React v18.3.7 integrado con Next.js App Router        | Alta      |
| RT-02 | La API debe estar implementada en Next.js 15.2.4 usando rutas del tipo App Router | Alta |
| RT-03 | La base de datos debe ser PostgreSQL mediante Supabase local en contenedor | Alta      |
| RT-04 | La lógica de autenticación y almacenamiento de archivos debe usar Supabase (sin GraphQL) | Alta |
| RT-05 | Las dependencias del core deben evitar acoplamiento con las herramientas específicas como Supabase o Next.js | Alta |
| RT-06 | Las claves privadas deben estar en .env.local y no en el repositorio | Media |

---

## 4. Consideraciones de Seguridad

- Se recomienda implementar validaciones estrictas tanto en frontend como en backend para la creación y edición de documentos.
- Los módulos de documentos compartidos deben llevar trazabilidad (logs de acceso y modificaciones).
- Se debe incluir control de acceso por roles (por ejemplo: docente, director, administrador).
- Para producción, se debe de ocultar Supabase Studio y securizar la base de datos.
- Se debe usar el protocolo HTTPS para todas las comunicaciones entre cliente y servidor.
- No debe haber logs en el código (e.g Console.log, Console.error, etc) cuando se distribuya el sistema, solo en el sistema de auditoría.

---

## 5. Anexos

- [architecture.md](./architecture.md)
- [testing.md](./testing.md)