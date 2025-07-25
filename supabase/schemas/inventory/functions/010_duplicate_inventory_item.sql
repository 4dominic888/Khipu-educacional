create or replace function public.duplicate_inventory_item(original_item_id uuid)
  returns uuid
  language plpgsql
  set search_path = ''
as $$
declare
  new_item_id uuid;
  v public.variant_inventory_item%rowtype;
begin

  insert into public.inventory_item (group_id, catalog_item_id, total)
  select group_id, catalog_item_id, total from public.inventory_item where id = original_item_id
  returning id into new_item_id;

  for v in
    select vii.*, a.type, a.number, a.date, a.price
    from public.variant_inventory_item vii
    join public.acquisition a on a.id = vii.acquisition_id
    where vii.inventory_item_id = original_item_id
  loop
    perform public.add_variant_with_acquisition(
      new_item_id,
      ROW(
        v.color,
        v.length,
        v.width,
        v.height,
        v.serial_number,
        v.brand,
        v.model,
        v.caracteristic,
        v.conservation_status,
        v.notes,
        v.images,
        v.count
      )::public.variant_input,
      ROW(
        v.type,
        v.number,
        v.date,
        v.price
      )::public.acquisition_input
    );
  end loop;

  return new_item_id;

exception
  when others then
    raise exception 'Error duplicating inventory_item %: %', original_item_id, sqlerrm;
end;
$$;