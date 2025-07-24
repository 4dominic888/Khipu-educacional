-- ========================
-- Periodos
-- ========================
insert into public.period_time (id, name) values
  ('00000000-0000-0000-0000-000000000000', '2024');

-- ========================
-- Catálogo
-- ========================
insert into public.catalog_item (id, name) values
  ('32220013', 'SILLA'),
  ('32220014', 'MESA'),
  ('32220015', 'PROYECTOR');

-- ========================
-- Grupos de inventario
-- ========================
insert into public.inventory_group (id, name, description, period) values
  ('10000000-0000-0000-0000-000000000001', 'Aula 1', 'Aula del segundo piso', '00000000-0000-0000-0000-000000000000'),
  ('10000000-0000-0000-0000-000000000002', 'Cocina', 'Área de preparación de alimentos', '00000000-0000-0000-0000-000000000000');

-- ========================
-- Ítems de inventario
-- ========================
insert into public.inventory_item (id, group_id, catalog_item_id, total) values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '32220013', 10), -- 10 sillas en aula
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '32220014', 5),  -- 5 mesas en aula
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', '32220015', 2);  -- 2 proyectores en cocina

-- ========================
-- Adquisiciones
-- ========================
insert into public.acquisition (id, type, number, date, price) values
  ('30000000-0000-0000-0000-000000000001', 'Recibo', 'R-001', '2024-01-10', 1500.00),
  ('30000000-0000-0000-0000-000000000002', 'Boleta', 'B-002', '2024-02-15', 3000.00),
  ('30000000-0000-0000-0000-000000000003', 'Donación', 'D-003', '2024-03-20', 120.00),
  ('30000000-0000-0000-0000-000000000004', 'Recibo', 'D-010', '2024-03-20', 2.00),
  ('30000000-0000-0000-0000-000000000005', 'Boleta', 'D-903', '2024-03-20', 98.00);

-- ========================
-- Variantes de inventario
-- ========================
insert into public.variant_inventory_item (
  id, inventory_item_id, color, length, width, height,
  serial_number, brand, model, caracteristic, conservation_status,
  acquisition_id, notes, images, count
) values
  ('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Negro', 0.45, 0.45, 0.90, 'SN-0001', 'MarcaX', 'SillaModA', 'Plástico con metal', 'Bueno', '30000000-0000-0000-0000-000000000001', 'En buenas condiciones', ARRAY['/images/silla1.jpg'], 5),
  ('40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'Azul', 0.45, 0.45, 0.90, 'SN-0002', 'MarcaY', 'SillaModB', 'Plástico reforzado', 'Regular', '30000000-0000-0000-0000-000000000002', null, ARRAY['/images/silla2.jpg'], 5),

  ('40000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', 'Madera', 1.2, 0.6, 0.75, null, 'Artesanos SRL', null, 'De 4 patas', 'Bueno', '30000000-0000-0000-0000-000000000003', 'Mesa sólida', ARRAY[]::text[], 5),

  ('40000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000003', 'Blanco', 0.3, 0.25, 0.1, 'PRJ-0001', 'BenQ', 'W1090', 'HDMI, VGA', 'Bueno', '30000000-0000-0000-0000-000000000004', 'Proyector con HDMI', ARRAY['/images/proyector1.jpg'], 1),
  ('40000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000003', 'Negro', 0.3, 0.25, 0.1, 'PRJ-0002', 'Epson', 'EB-S41', 'HD Ready', 'Malo', '30000000-0000-0000-0000-000000000005', 'Lámpara quemada', ARRAY['/images/proyector2.jpg'], 1);
