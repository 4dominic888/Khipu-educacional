create or replace function public.edit_group(
  inventory_group_id_to_edit uuid,
  group_value public.group_input
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
