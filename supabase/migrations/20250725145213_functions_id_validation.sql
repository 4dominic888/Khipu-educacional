set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_variant_with_acquisition(_inventory_item_id uuid, _variant variant_input, _acquisition acquisition_input)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.delete_variants(item_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.duplicate_group(original_group_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  new_group_id uuid;
  v public.inventory_group%rowtype;
  existing_group boolean;
begin

  select exists(
    select 1 from public.inventory_group where id = original_group_id
  ) into existing_group;

  if not existing_group then
    raise exception 'No se ha podido duplicar el grupo de inventario, no existe';
  end if;

  insert into public.inventory_group (name, description, period)
  select name, description, period from public.inventory_group where id = original_group_id
  returning id into new_group_id;

  for v in select * from public.inventory_item where group_id = original_group_id loop
    perform public.duplicate_inventory_item(v.id);
  end loop;

  return new_group_id;
exception
  when others then
    raise exception 'Error duplicating inventory_group %: %', original_group_id, sqlerrm;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.duplicate_inventory_item(original_item_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  new_item_id uuid;
  v public.variant_inventory_item%rowtype;
  existing_item boolean;
begin

  select exists(
    select 1 from public.inventory_item where id = original_item_id
  ) into existing_item;

  if not existing_item then
    raise exception 'No se ha podido duplicar el item de inventario, no existe';
  end if;

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
$function$
;

CREATE OR REPLACE FUNCTION public.duplicate_group(original_group_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  new_group_id uuid;
  v public.inventory_group%rowtype;
  existing_group boolean;
  original_name text;
  base_name text;
  new_name text;
  suffix int := 1;
begin

  select exists(
    select 1 from public.inventory_group where id = original_group_id
  ) into existing_group;

  if not existing_group then
    raise exception 'No se ha podido duplicar el grupo de inventario, no existe';
  end if;

  --* Get the original name of the group.
  select name into original_name from public.inventory_group where id = original_group_id;

  --* REGEX Expression to remove some (n) suffix in the base_name if exists.
  base_name := regexp_replace(original_name, ' \(\d+\)$', '');

  loop
    new_name := base_name || ' (' || suffix || ')';
    exit when not exists(
      select 1 from public.inventory_group where name = new_name
    );
    suffix := suffix + 1;
  end loop;


  insert into public.inventory_group (name, description, period)
  select new_name, description, period from public.inventory_group where id = original_group_id
  returning id into new_group_id;

  for v in select * from public.inventory_item where group_id = original_group_id loop
    perform public.duplicate_inventory_item(v.id);
  end loop;

  return new_group_id;
exception
  when others then
    raise exception 'Error duplicating inventory_group %, %, %, %: %', original_group_id, new_group_id, new_name, v, sqlerrm;
end;
$function$
;