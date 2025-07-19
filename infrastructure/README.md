# Infrastructure

Esta carpeta solo contendra la implementaciones de los puertos de la carpeta `core`.

## Repositorios

Los repositorios son la capa de persistencia de la aplicación. Están implementados en la carpeta `repositories`.
Cada repositorio debe implementar el decorador `LogMethod` para que se puedan registrar los logs de cada método.
También agregar con `logger` algunos logs importantes de interes dentro de la implementación de cada método.