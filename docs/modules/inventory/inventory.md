# 📦 Módulo de Inventario

Este módulo permite gestionar el inventario de bienes inmuebles con base en un catálogo institucional. Facilita el llenado eficiente, agrupación, exportación y manejo de variaciones de ítems, respondiendo a las necesidades de los docentes que tradicionalmente realizaban este proceso manualmente en Excel.
# 📌 Caso de Uso: RF-05, El sistema debe permitir gestionar bienes inmuebles mediante un inventario
## 🧾 Descripción General

Permite a docentes agregar ítems del catálogo institucional de bienes inmuebles al inventario, personalizarlos mediante variaciones (color, medidas, estado, adquisición, etc.), agruparlos por espacios físicos (como aulas, cocinas) y organizarlos en periodos (e.g., años o semestres). Se incluye soporte para duplicar elementos, moverlos, y exportar los datos en formatos compatibles con el Excel original.
## 👤 Actores Principales

- Docente / Usuario responsable: Agrega, modifica y organiza ítems del inventario.

- Sistema: Valida la información, gestiona grupos, periodos y genera reportes.

## ✅ Precondiciones

Existe un catálogo de ítems actualizado, importado desde un archivo Excel provisto por el ente institucional.

El docente está autenticado y tiene acceso a la interfaz web.

Al menos un período activo debe estar definido para permitir agrupaciones.

## 🎯 Criterios de Aceptación

No se puede crear un ítem desde cero; debe seleccionarse uno del catálogo existente.

Cada ítem añadido debe tener al menos una variante con datos completos requeridos.

Un grupo no puede contener ítems repetidos.

Es posible duplicar ítems, grupos y periodos de forma parcial o completa.

El sistema debe permitir exportar un grupo o periodo en el formato Excel esperado por la institución.

Cada grupo puede tener el mismo nombre si está en un periodo distinto.

El dashboard debe mostrar datos agregados útiles (por estado de conservación, cantidades, etc.).

Solo se pueden agregar ítems del catálogo válido vigente.

## 🔁 Flujo Principal

El docente importa o visualiza el catálogo institucional.

El docente crea un periodo (si no existe).

El docente crea grupos dentro del periodo, como "Aula 1", "Cocina", etc.

El docente añade ítems desde el catálogo a un grupo.

Por cada ítem añadido, el docente define una o más variaciones:

    Color

    Medidas (largo, ancho, alto en metros)

    Estado de conservación

    Tipo y número de documento de adquisición

    Fecha, valor, observaciones

    Multimedia opcional

El sistema almacena los ítems con sus respectivas variaciones y cantidades.

El docente puede mover o copiar ítems, grupos o periodos.

El docente accede al dashboard para obtener una visión general.

El docente exporta la información a Excel desde un grupo o un periodo completo.

## ❗Errores Alternativos

❌ El catálogo no ha sido cargado: se muestra un mensaje y se bloquea la acción de agregar ítems.

❌ Campos inválidos en una variación (ej. medida no numérica, fecha incorrecta): se indica el error antes de permitir el guardado.

❌ Se intenta duplicar un ítem ya existente en el mismo grupo: operación bloqueada con advertencia.

❌ El intento de exportar sin datos válidos (e.g., grupo vacío): muestra error claro al usuario.

❌ El formato de Excel no puede generarse por campos faltantes: se alerta del campo que bloquea la exportación.