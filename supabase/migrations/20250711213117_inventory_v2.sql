-- Habilitar extensiones necesarias
create extension if not exists "pgcrypto";

-- ================================
-- TABLAS
-- ================================

-- Catálogo
create table public.catalog_item (
  id uuid primary key default gen_random_uuid(),
  name text not null
);

-- Grupo de Inventario
create table public.inventory_group (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text
);

-- Item de Inventario
create table public.inventory_item (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.inventory_group(id) on delete cascade,
  catalog_item_id uuid not null references public.catalog_item(id) on delete restrict,
  total integer not null check (total >= 0)
);

-- Adquisición
create table public.acquisition (
  id uuid primary key default gen_random_uuid(),
  type text check (type in ('Recibo', 'Boleta', 'Donación')) not null,
  number text not null,
  date date not null,
  price numeric(12,2) not null
);

-- Variante del Item
create table public.variant_inventory_item (
  id uuid primary key default gen_random_uuid(),
  inventory_item_id uuid not null references public.inventory_item(id) on delete cascade,
  color text not null,
  length numeric(6,3) not null,
  width numeric(6,3) not null,
  height numeric(6,3) not null,
  serial_number text,
  brand text,
  model text,
  caracteristic text,
  conservation_status text check (conservation_status in ('Bueno', 'Regular', 'Malo')) not null,
  acquisition_id uuid not null references public.acquisition(id) on delete restrict,
  notes text,
  images text[],
  count integer not null check (count > 0)
);

-- ================================
-- VISTAS DE RESUMEN
-- ================================

-- Vista resumida por ítem (para InventoryItemSummary)
create view public.inventory_item_summary as
select
  ii.id,
  ii.total,
  ci.id as catalog_item_id,
  ci.name as catalog_item_name
from public.inventory_item ii
join public.catalog_item ci on ci.id = ii.catalog_item_id;

-- Vista de grupo con conteo total de variantes (para InventoryGroupInfo)
create view public.inventory_group_info as
select
  ig.id,
  ig.name,
  ig.description,
  count(vi.id) as count
from public.inventory_group ig
left join public.inventory_item ii on ii.group_id = ig.id
left join public.variant_inventory_item vi on vi.inventory_item_id = ii.id
group by ig.id, ig.name, ig.description;
