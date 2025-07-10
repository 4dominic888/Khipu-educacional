# Datos del bien patrimonial

## Datos generales
### CAMPOS SELECCIONABLES EN BASE A DATOS EXTERNOS
El catalogo tiene un listado general de
- Código | COD. MARGESI DEL BIEN (e.g., "32640050") 
- Nombre del producto | NOMBRE DEL BIEN PATRIMONIAL (e.g., "Archivador de metal")

### CAMPOS MANUALES Y CON POSIBLES VARIACIONES
- Color (e.g., "Azul"), debe ser un color literal, no hexadecimal
- Medidas (e.g., "2.50X0.95X0.70"), necesita ser un campo compuesto y 
    se mide en metros decimales, se ordena en: largo, ancho y alto respectivamente
- Número de serie (e.g., "1234567890")
- Marca (e.g., "Mobiliario Escolar SAC")
- Modelo (e.g., "Escritorio ejecutivo")
- Características (e.g., "Ovalada")
- Estado de conservación (e.g., "Bueno | Regular | Malo")

## Datos de la adquisición (variante igualmente)
- Tipo de adquisición (Recibo | Boleta | Donación)
- Número de adquisición (e.g., "B001-00456")
- Fecha de adquisición (e.g., "2024-02-20")
- Valor de adquisición (e.g., "45.0")

## Observaciones e contenido multimedia
- Observaciones (e.g., "Para aulas de primaria")
- Imagenes (e.g., "https://example.com/image.jpg", "https://example.com/image2.png)

# Registro de inventario

Los datos suelen repetirse en las tablas del formato original, indicando de esa manera las variaciones que tendra.
Ejemplo:
- Mesa de madera | Marrón | 2.50X0.95X0.70 | ... | Bueno | Recibo | B001-00234 | 2024-02-01 | 180.0
- Mesa de madera | Marrón | 1.20X0.70X0.60 | ... | Bueno | Recibo | B001-00234 | 2024-02-01 | 180.0
- Mesa de madera | Marrón | 1.20X0.70X0.60 | ... | Bueno | Recibo | B001-00234 | 2024-02-01 | 180.0
- Mesa de madera | Verde  | 2.50X0.95X0.70 | ... | Bueno | Boleta | B001-00234 | 2024-03-01 | 180.0
- Sillas | Verde  | 1.20X0.70X0.60 | ... | Bueno | Recibo | B001-00234 | 2024-02-01 | 180.0
- ...

Se debe de poder agrupar estos por tipo de producto.

# Otro tipo de grupo

Los grupos generado por el usuario, donde agrupa estos grupos por aula, cocina, etc.

En el ejemplo anterior, las mesas y sillas pertenecen a una aula.