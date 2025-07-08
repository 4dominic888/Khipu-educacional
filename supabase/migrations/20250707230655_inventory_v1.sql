-- Tabla: Grupos de inventario
create table public.inv_group (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tabla: Items del inventario
create table public.inv_item (
  id uuid primary key default gen_random_uuid(),
  product_type text not null,
  serial_number text,
  image_url text,
  group_id uuid references public.inv_group(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tabla: Variantes (color, tamaño, marca, etc.)
create table public.inv_item_variant (
  item_id uuid primary key references public.inv_item(id) on delete cascade,
  color text,
  size text,
  material text,
  brand text,
  model text,
  specifications text
);

-- Tabla: Dimensiones físicas
create table public.inv_item_dimensions (
  item_id uuid primary key references public.inv_item(id) on delete cascade,
  length numeric,
  width numeric,
  height numeric
);

-- Tabla: Estados de los ítems (adquisición, condición, ubicación)
create table public.inv_item_state (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.inv_item(id) on delete cascade,
  condition text not null check (condition in ('Bueno', 'Regular', 'Malo')),
  acquisition_type text not null check (acquisition_type in ('Recibo', 'Boleta', 'Donación')),
  acquisition_number text not null,
  acquisition_date date not null,
  unit_value numeric not null,
  quantity integer not null,
  observations text,
  location text
);
