-- ================================
-- FUNCIONES AUXILIARES
-- ================================

-- Tipos auxiliares
create type variant_input as (
  color text,
  length numeric,
  width numeric,
  height numeric,
  serial_number text,
  brand text,
  model text,
  caracteristic text,
  conservation_status text,
  notes text,
  images text[],
  count integer
);

create type acquisition_input as (
  type text,
  number text,
  date date,
  price numeric
);

create type group_input as (
  name text,
  description text,
  period uuid
);

create or replace function public.add_variant_with_acquisition(
  _inventory_item_id uuid,
  _variant variant_input,
  _acquisition acquisition_input
)
  returns uuid
  language plpgsql
  set search_path = ''
as $$
declare
  new_acquisition_id uuid;
  new_variant_id uuid;
begin

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


create or replace function public.update_variant_with_acquisition(
  _inventory_item_id uuid,
  _variant variant_input,
  _acquisition acquisition_input
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
      )::variant_input,
      ROW(
        v.type,
        v.number,
        v.date,
        v.price
      )::acquisition_input
    );
  end loop;

  return new_item_id;

exception
  when others then
    raise exception 'Error duplicating inventory_item %: %', original_item_id, sqlerrm;
end;
$$;


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

create or replace function public.duplicate_group(original_group_id uuid)
  returns uuid
  language plpgsql
  set search_path = ''
as $$
declare
  new_group_id uuid;
  v public.inventory_group%rowtype;
begin
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
$$;


create or replace function public.edit_group(
  inventory_group_id_to_edit uuid,
  group_value group_input
)
  returns inventory_group
  language plpgsql
  set search_path = ''
as $$
declare
  existing_group boolean;
  existing_period boolean;
  group_value_to_return public.inventory_group%rowtype;
begin

  select exists(
    select 1 from public.inventory_group where id = inventory_group_id_to_edit
  ) into existing_group;

  if not existing_group then
    raise exception 'No se ha podido editar el grupo de inventario, no existe';
  end if;

  if group_value.period is not null then
    select exists(
      select 1 from public.period_time where id = group_value.period
    ) into existing_period;

    if not existing_period then
      raise exception 'No se ha podido editar el grupo de inventario, no existe el periodo';
    end if;
  end if;

  update public.inventory_group
  set
    name = coalesce(group_value.name, name),
    description = coalesce(group_value.description, description),
    period = coalesce(group_value.period, period)
  where id = inventory_group_id_to_edit returning * into group_value_to_return;

  return group_value_to_return;
end;
$$;
