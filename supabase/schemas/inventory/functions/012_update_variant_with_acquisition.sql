create or replace function public.update_variant_with_acquisition(
  _inventory_item_id uuid,
  _variant public.variant_input,
  _acquisition public.acquisition_input
)
  returns void
  language plpgsql
  set search_path = ''
as $$
declare
  acquisition_id_belonged uuid;
begin
  update public.variant_inventory_item
  set
    color = coalesce(_variant.color, color),
    length = coalesce(_variant.length, length),
    width = coalesce(_variant.width, width),
    height = coalesce(_variant.height, height),
    serial_number = coalesce(_variant.serial_number, serial_number),
    brand = coalesce(_variant.brand, brand),
    model = coalesce(_variant.model, model),
    caracteristic = coalesce(_variant.caracteristic, caracteristic),
    conservation_status = coalesce(_variant.conservation_status, conservation_status),
    notes = coalesce(_variant.notes, notes),
    images = coalesce(_variant.images, images),
    count = coalesce(_variant.count, count)
  where inventory_item_id = _inventory_item_id
  returning acquisition_id into acquisition_id_belonged;

  if _acquisition is not null then
    update public.acquisition
    set
      type = _acquisition.type,
      number = _acquisition.number,
      date = _acquisition.date,
      price = _acquisition.price
    where id = acquisition_id_belonged;
  end if;

end;
$$;