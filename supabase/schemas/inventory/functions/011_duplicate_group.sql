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