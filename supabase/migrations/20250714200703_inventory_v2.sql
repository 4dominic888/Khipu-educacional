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
-- Auditoría para variant_inventory_item
-- ================================

create table if not exists public.variant_inventory_item_audit (
  audit_id uuid primary key default gen_random_uuid(),
  variant_id uuid,
  operation text, -- 'INSERT', 'UPDATE'
  old_data jsonb,
  new_data jsonb,
  changed_at timestamp with time zone default now()
);

create or replace function public.audit_variant_item()
  returns trigger
  language plpgsql
  set search_path = ''
as $$
begin
  insert into public.variant_inventory_item_audit (
    variant_id, operation, old_data, new_data
  )
  values (
    coalesce(new.id, old.id),
    TG_OP,
    to_jsonb(old),
    to_jsonb(new)
  );
  return new;
end
$$;


create trigger trg_audit_variant_inventory_item
after insert or update on public.variant_inventory_item
for each row
execute function public.audit_variant_item();

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

-- ================================
-- Funcion: registrar adquisición con items
-- ================================

create or replace function public.register_acquisition_with_items(
  in_acquisition_id uuid,
  in_inventory_items jsonb
)
  returns void
  language plpgsql
  set search_path = ''
as $$
declare
  item jsonb;
begin
  for item in select * from jsonb_array_elements(in_inventory_items)
  loop
    insert into public.inventory_item (
      id,
      group_id,
      catalog_item_id,
      total
    ) values (
      (item->>'id')::uuid,
      (item->>'group_id')::uuid,
      (item->>'catalog_item_id')::text,
      (item->>'total')::int
    );
  end loop;
end;
$$;
