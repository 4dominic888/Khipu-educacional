-- Habilitar extensiones necesarias
create extension if not exists "pgcrypto";
create extension if not exists "pgaudit" schema extensions;

-- ================================
-- TABLAS DE PERIODOS GENERAL
-- ================================
create table public.period_time (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text
);

-- ================================
-- TABLAS
-- ================================

-- Catálogo
create table public.catalog_item (
  id text not null primary key,
  name text not null unique
);

-- Grupo de Inventario
create table public.inventory_group (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  period uuid not null references public.period_time(id) on delete cascade,
  unique (name, period)
);

-- Item de Inventario
create table public.inventory_item (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.inventory_group(id) on delete cascade,
  catalog_item_id text not null references public.catalog_item(id) on delete cascade,
  total integer not null check (total >= 0)
);

-- Adquisición
create table public.acquisition (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('Recibo', 'Boleta', 'Donación')),
  number text not null check (char_length(number) > 0),
  date date not null,
  price numeric(12, 2) not null check (price >= 0)
);

-- Variante del Item
create table public.variant_inventory_item (
  id uuid primary key default gen_random_uuid(),
  inventory_item_id uuid not null references public.inventory_item(id) on delete cascade,
  color text not null check (char_length(color) > 0),
  length numeric(6,3) not null check (length >= 0),
  width numeric(6,3) not null check (width >= 0),
  height numeric(6,3) not null check (height >= 0),
  serial_number text,
  brand text,
  model text,
  caracteristic text,
  conservation_status text not null check (conservation_status in ('Bueno', 'Regular', 'Malo')),
  acquisition_id uuid not null references public.acquisition(id) on delete cascade,
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
create or replace view public.inventory_group_info as
select
  ig.id,
  ig.name,
  ig.description,
  ig.period,
  coalesce(sum(ii.total), 0)::int as count
from public.inventory_group ig
left join public.inventory_item ii on ii.group_id = ig.id
group by ig.id, ig.name, ig.description;
