CREATE UNIQUE INDEX inventory_item_group_id_catalog_item_id_key ON public.inventory_item USING btree (group_id, catalog_item_id);

alter table "public"."inventory_item" add constraint "inventory_item_group_id_catalog_item_id_key" UNIQUE using index "inventory_item_group_id_catalog_item_id_key";


