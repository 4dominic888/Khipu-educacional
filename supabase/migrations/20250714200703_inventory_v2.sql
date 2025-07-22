-- ================================
-- updated_at en tablas clave
-- ================================

alter table public.inventory_item
add column if not exists updated_at timestamp with time zone default now();

alter table public.variant_inventory_item
add column if not exists updated_at timestamp with time zone default now();

alter table public.inventory_group
add column if not exists updated_at timestamp with time zone default now();

-- ================================
-- Trigger set_updated_at
-- ================================

create or replace function public.set_updated_at()
  returns trigger
  language plpgsql
  set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end
$$;

create trigger trg_set_updated_at_inventory_item
before update on public.inventory_item
for each row
execute function public.set_updated_at();

create trigger trg_set_updated_at_variant_item
before update on public.variant_inventory_item
for each row
execute function public.set_updated_at();

create trigger trg_set_updated_at_inventory_group
before update on public.inventory_group
for each row
execute function public.set_updated_at();

-- ================================
-- Trigger para actualizar inventory_item.total
-- ================================

create or replace function public.update_inventory_total()
  returns trigger
  language plpgsql
  set search_path = ''
as $$
begin
  update public.inventory_item
  set total = (
    select coalesce(sum(count), 0)
    from public.variant_inventory_item
    where inventory_item_id = new.inventory_item_id
  )
  where id = new.inventory_item_id;
  return new;
end
$$;

create trigger trg_update_total_after_insert
after insert on public.variant_inventory_item
for each row
execute function public.update_inventory_total();

create trigger trg_update_total_after_update
after update on public.variant_inventory_item
for each row
execute function public.update_inventory_total();

create trigger trg_update_total_after_delete
after delete on public.variant_inventory_item
for each row
execute function public.update_inventory_total();