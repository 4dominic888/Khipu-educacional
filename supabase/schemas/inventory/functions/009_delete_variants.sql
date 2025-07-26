create or replace function public.delete_variants(item_id uuid)
  returns void
  language plpgsql
  set search_path = ''
as $$
declare
  existing_item boolean;
begin
  select exists(
    select 1 from public.inventory_item where id = item_id
  ) into existing_item;

  if not existing_item then
    raise exception 'No se ha podido eliminar las variantes, no existe el item';
  end if;

  delete from public.acquisition where id in (
    select acquisition_id from public.variant_inventory_item where inventory_item_id = item_id
  );
end;
$$;
