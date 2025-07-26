set check_function_bodies = off;

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


