create or replace function public.add_variant_with_acquisition(
  _inventory_item_id uuid,
  _variant public.variant_input,
  _acquisition public.acquisition_input
)
  returns uuid
  language plpgsql
  set search_path = ''
as $$
declare
  new_acquisition_id uuid;
  new_variant_id uuid;
  existing_inventory_item boolean;
begin

  select exists(
    select 1 from public.inventory_item where id = _inventory_item_id
  ) into existing_inventory_item;

  if not existing_inventory_item then
    raise exception 'No se ha podido agregar la variante, no existe el item';
  end if;

  insert into public.acquisition (type, number, date, price)
  values (_acquisition.type, _acquisition.number, _acquisition.date, _acquisition.price)
  returning id into new_acquisition_id;

  insert into public.variant_inventory_item (
    inventory_item_id,
    color,
    length,
    width,
    height,
    serial_number,
    brand,
    model,
    caracteristic,
    conservation_status,
    acquisition_id,
    notes,
    images,
    count
  ) values (
    _inventory_item_id,
    _variant.color,
    _variant.length,
    _variant.width,
    _variant.height,
    _variant.serial_number,
    _variant.brand,
    _variant.model,
    _variant.caracteristic,
    _variant.conservation_status,
    new_acquisition_id,
    _variant.notes,
    _variant.images,
    _variant.count
  ) returning id into new_variant_id;

  return new_variant_id;
end;
$$;
