-- Vista resumida por ítem (para InventoryItemSummary)
create view public.inventory_item_summary as
select
  ii.id,
  ii.total,
  ci.id as catalog_item_id,
  ci.name as catalog_item_name
from public.inventory_item ii
join public.catalog_item ci on ci.id = ii.catalog_item_id;

-- Vista de grupo con conteo total de variantes (para InventoryGroupInfo)
create or replace view public.inventory_group_info as
select
  ig.id,
  ig.name,
  ig.description,
  ig.period,
  coalesce(sum(ii.total), 0)::int as count
from public.inventory_group ig
left join public.inventory_item ii on ii.group_id = ig.id
group by ig.id, ig.name, ig.description;