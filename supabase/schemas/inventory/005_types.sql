create type public.variant_input as (
  color text,
  length numeric,
  width numeric,
  height numeric,
  serial_number text,
  brand text,
  model text,
  caracteristic text,
  conservation_status text,
  notes text,
  images text[],
  count integer
);

create type public.acquisition_input as (
  type text,
  number text,
  date date,
  price numeric
);

create type public.group_input as (
  name text,
  description text,
  period uuid
);