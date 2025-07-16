Este directorio contiene la lógica de la aplicación y del negocio.
La implementación de cada una de las capas definidas se hará en la carpeta `infrastructure`.

## Directorios

### `domain`

Contiene los modelos de dominio de la aplicación. Principalmente los tipos.

### `ports`

Contiene logica técnica base para el dominio de la aplicación. Funcionan como los contratos que deben seguir las implementaciones.

Esta dividido por varias subcarpetas:

- `repositories`: Repositorios de datos de la aplicación.
- `auth`: Autenticación y autorización.
- `storage`: Almacenamiento de datos.

>[!NOTE]
>Este directorio puede tener más modulos como notificaciones, integraciones, etc.

### `use-cases`

Contiene los casos de uso de la aplicación, en si se pueden ver como los servicios de dominio.

Algunos casos de uso pueden ser muy simples, por lo que a veces solo se debe de usar directamente un puerto.

Su estructura se basa en las features de este proyecto, cada una de las carpetas contiene una funcionalidad.
Cada feature tiene una logica de negocio asociada, donde se hace inyección de dependencias de los puertos definidos en `ports`.

### `shared`

Contiene código útil reutilizable en toda esta carpeta.

- Posee un componente `result` que es para aplicar el patrón de diseño Result.
- Posee un componente `filter` que es para facilitar la creación de filtros.
- Posee un componente `repository-base` que proporciona algunas interfaces genericas para CRUDs básicos.
- `extra` contiene componentes adicionales que no son necesarios para el negocio, pero que son útiles para la aplicación.