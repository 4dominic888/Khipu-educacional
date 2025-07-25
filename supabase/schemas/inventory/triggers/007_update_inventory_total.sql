create or replace function public.update_inventory_total()
  returns trigger
  language plpgsql
  set search_path = ''
as $$
begin
  update public.inventory_item
  set total = (
    select coalesce(sum(count), 0)
    from public.variant_inventory_item
    where inventory_item_id = new.inventory_item_id
  )
  where id = new.inventory_item_id;
  return new;
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