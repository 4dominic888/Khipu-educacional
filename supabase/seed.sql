-- INSERTAR GRUPOS
insert into public.inv_group (id, name, description)
values
  (gen_random_uuid(), 'Aula', 'Equipamiento de salón de clases'),
  (gen_random_uuid(), 'Cocina', 'Utensilios y mobiliario de cocina'),
  (gen_random_uuid(), 'Comedor', 'Mobiliario para comedor público');

-- Aula: 8 productos
insert into public.inv_item (id, product_type, serial_number, image_url, group_id)
select gen_random_uuid(), p.product_type, p.serial_number, p.image_url, g.id
from (
  values
    ('Pizarra blanca', 'PB001', null),
    ('Silla de plástico', 'SP001', null),
    ('Silla de plástico', 'SP002', null),
    ('Silla de plástico', 'SP003', null),
    ('Mesa de madera', 'MM001', null),
    ('Escritorio', 'E001', null),
    ('Proyector', 'PRJ001', null),
    ('Computadora portátil', 'LPT001', null)
) as p(product_type, serial_number, image_url)
join public.inv_group g on g.name = 'Aula';

-- Cocina: 6 productos
insert into public.inv_item (id, product_type, serial_number, image_url, group_id)
select gen_random_uuid(), p.product_type, p.serial_number, p.image_url, g.id
from (
  values
    ('Cocina a gas', 'CG001', null),
    ('Olla de aluminio', 'OL001', null),
    ('Refrigeradora', 'RF001', null),
    ('Sartén antiadherente', 'SR001', null),
    ('Mesa de acero inoxidable', 'MA001', null),
    ('Taza de cerámica', 'TC001', null)
) as p(product_type, serial_number, image_url)
join public.inv_group g on g.name = 'Cocina';

-- Comedor: 6 productos
insert into public.inv_item (id, product_type, serial_number, image_url, group_id)
select gen_random_uuid(), p.product_type, p.serial_number, p.image_url, g.id
from (
  values
    ('Mesa rectangular', 'MR001', null),
    ('Mesa rectangular', 'MR002', null),
    ('Silla metálica', 'SM001', null),
    ('Silla metálica', 'SM002', null),
    ('Silla metálica', 'SM003', null),
    ('Dispensador de agua', 'DA001', null)
) as p(product_type, serial_number, image_url)
join public.inv_group g on g.name = 'Comedor';

-- ASIGNAR VARIANTES (solo a algunos productos representativos)
insert into public.inv_item_variant (item_id, color, size, material, brand, model, specifications)
select i.id, v.color, v.size, v.material, v.brand, v.model, v.specifications
from (
  values
    ('Proyector', 'Negro', 'Mediano', 'Plástico', 'Epson', 'X100', 'HD 1080p'),
    ('Computadora portátil', 'Gris', '13"', 'Metal', 'Lenovo', 'ThinkPad X1', 'Intel i5'),
    ('Silla de plástico', 'Azul', 'Estándar', 'Plástico', null, null, null),
    ('Mesa de madera', 'Marrón', 'Grande', 'Madera', null, null, null),
    ('Refrigeradora', 'Blanco', 'Grande', 'Metal', 'Samsung', 'RT32', 'Doble puerta'),
    ('Cocina a gas', 'Plata', 'Mediana', 'Acero', 'Indurama', '4Q', '4 quemadores')
) as v(product_type, color, size, material, brand, model, specifications)
join public.inv_item i on i.product_type = v.product_type;

-- ASIGNAR DIMENSIONES
insert into public.inv_item_dimensions (item_id, length, width, height)
select i.id, d.length, d.width, d.height
from (
  values
    ('Pizarra blanca', 120, 2, 90),
    ('Mesa de madera', 150, 70, 75),
    ('Refrigeradora', 60, 60, 170),
    ('Proyector', 30, 25, 10),
    ('Mesa de acero inoxidable', 180, 60, 85),
    ('Mesa rectangular', 200, 90, 75)
) as d(product_type, length, width, height)
join public.inv_item i on i.product_type = d.product_type;

-- ESTADOS (una o más por producto)
insert into public.inv_item_state (
  item_id, condition, acquisition_type, acquisition_number, acquisition_date, unit_value, quantity, observations, location
)
select i.id,
       s.condition, s.acquisition_type, s.acquisition_number, s.acquisition_date, s.unit_value, s.quantity,
       s.observations, s.location
from (
  values
    ('Pizarra blanca', 'Bueno', 'Recibo', 'R001', '2023-01-05'::date, 300.00, 1, 'Instalada en la pared principal', 'Aula'),
    ('Silla de plástico', 'Regular', 'Boleta', 'B101', '2022-03-10'::date, 25.00, 3, 'Desgastadas por uso diario', 'Aula'),
    ('Mesa de madera', 'Bueno', 'Boleta', 'B102', '2022-03-10'::date, 120.00, 1, null, 'Aula'),
    ('Proyector', 'Bueno', 'Donación', 'D900', '2024-02-20'::date, 600.00, 1, 'Funciona con control remoto', 'Aula'),
    ('Computadora portátil', 'Regular', 'Recibo', 'R222', '2021-06-15'::date, 1500.00, 1, 'Batería con poca duración', 'Aula'),
    ('Cocina a gas', 'Bueno', 'Boleta', 'B300', '2023-10-10'::date, 800.00, 1, null, 'Cocina'),
    ('Refrigeradora', 'Bueno', 'Boleta', 'B301', '2023-10-10'::date, 1200.00, 1, null, 'Cocina'),
    ('Mesa de acero inoxidable', 'Bueno', 'Boleta', 'B302', '2023-10-10'::date, 450.00, 1, null, 'Cocina'),
    ('Taza de cerámica', 'Malo', 'Recibo', 'R555', '2020-01-01'::date, 2.00, 1, 'Tiene una grieta', 'Cocina'),
    ('Sartén antiadherente', 'Bueno', 'Boleta', 'B400', '2023-01-10'::date, 35.00, 1, null, 'Cocina'),
    ('Mesa rectangular', 'Bueno', 'Boleta', 'B500', '2023-05-01'::date, 180.00, 2, null, 'Comedor'),
    ('Silla metálica', 'Regular', 'Boleta', 'B501', '2023-05-01'::date, 50.00, 3, 'Rayaduras leves', 'Comedor'),
    ('Dispensador de agua', 'Bueno', 'Donación', 'D888', '2024-06-01'::date, 300.00, 1, null, 'Comedor')
) as s(product_type, condition, acquisition_type, acquisition_number, acquisition_date, unit_value, quantity, observations, location)
join public.inv_item i on i.product_type = s.product_type;