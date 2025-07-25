create or replace function public.delete_variants(item_id uuid)
  returns void
  language plpgsql
  set search_path = ''
as $$
begin
  delete from public.acquisition where id in (
    select acquisition_id from public.variant_inventory_item where inventory_item_id = item_id
  );
end;
$$;