create or replace function public.update_inventory_total()
  returns trigger
  language plpgsql
  set search_path = ''
as $$
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
$$;

create trigger trg_update_total_after_insert
after insert on public.variant_inventory_item
for each row
execute function public.update_inventory_total();

create trigger trg_update_total_after_update
after update on public.variant_inventory_item
for each row
execute function public.update_inventory_total();

create trigger trg_update_total_after_delete
after delete on public.variant_inventory_item
for each row
execute function public.update_inventory_total();