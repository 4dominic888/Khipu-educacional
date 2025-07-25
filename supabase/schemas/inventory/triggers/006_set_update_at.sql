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