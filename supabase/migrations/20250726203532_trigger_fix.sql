set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_inventory_total()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  affected_ids uuid[] := array[]::uuid[];
begin

  if tg_op in('INSERT', 'DELETE') then
    affected_ids := array_append(
      affected_ids,
      case tg_op
        when 'INSERT' then new.inventory_item_id
        else old.inventory_item_id
      end
    );
  elsif tg_op = 'UPDATE' then
    if new.inventory_item_id is distinct from old.inventory_item_id then
      affected_ids := array_append(affected_ids, old.inventory_item_id);
    end if;
    affected_ids := array_append(affected_ids, new.inventory_item_id);
  end if;

  update public.inventory_item i
  set total = (
    select coalesce(sum(count), 0)
    from public.variant_inventory_item vii
    where vii.inventory_item_id = i.id
  )
  where i.id = any (affected_ids);
  return null;
end
$function$
;

CREATE OR REPLACE FUNCTION public.update_variant_with_acquisition(_variant_inventory_item_id uuid, _variant variant_input, _acquisition acquisition_input)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  acquisition_id_belonged uuid;
  existing_variant boolean;
begin

  select exists(
    select 1 from public.variant_inventory_item where id = _variant_inventory_item_id
  ) into existing_variant;

  if not existing_variant then
    raise exception 'No se ha podido editar la variante, no existe el item';
  end if;

  select id into acquisition_id_belonged from public.acquisition where id = 
    (select acquisition_id from public.variant_inventory_item where id = _variant_inventory_item_id);

  if _acquisition is not null then
    update public.acquisition
    set
      type = _acquisition.type,
      number = _acquisition.number,
      date = _acquisition.date,
      price = _acquisition.price
    where id = acquisition_id_belonged;
  end if;

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
    acquisition_id = acquisition_id_belonged,
    notes = coalesce(_variant.notes, notes),
    images = coalesce(_variant.images, images)
  where id = _variant_inventory_item_id;
end;
$function$
;