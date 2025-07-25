create extension if not exists "pgaudit" with schema "extensions";


create table "public"."acquisition" (
    "id" uuid not null default gen_random_uuid(),
    "type" text not null,
    "number" text not null,
    "date" date not null,
    "price" numeric(12,2) not null
);


create table "public"."catalog_item" (
    "id" text not null,
    "name" text not null
);


create table "public"."inventory_group" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "description" text,
    "period" uuid not null,
    "updated_at" timestamp with time zone default now()
);


create table "public"."inventory_item" (
    "id" uuid not null default gen_random_uuid(),
    "group_id" uuid not null,
    "catalog_item_id" text not null,
    "total" integer not null,
    "updated_at" timestamp with time zone default now()
);


create table "public"."period_time" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "description" text
);


create table "public"."variant_inventory_item" (
    "id" uuid not null default gen_random_uuid(),
    "inventory_item_id" uuid not null,
    "color" text not null,
    "length" numeric(6,3) not null,
    "width" numeric(6,3) not null,
    "height" numeric(6,3) not null,
    "serial_number" text,
    "brand" text,
    "model" text,
    "caracteristic" text,
    "conservation_status" text not null,
    "acquisition_id" uuid not null,
    "notes" text,
    "images" text[],
    "count" integer not null,
    "updated_at" timestamp with time zone default now()
);


CREATE UNIQUE INDEX acquisition_pkey ON public.acquisition USING btree (id);

CREATE UNIQUE INDEX catalog_item_name_key ON public.catalog_item USING btree (name);

CREATE UNIQUE INDEX catalog_item_pkey ON public.catalog_item USING btree (id);

CREATE UNIQUE INDEX inventory_group_name_period_key ON public.inventory_group USING btree (name, period);

CREATE UNIQUE INDEX inventory_group_pkey ON public.inventory_group USING btree (id);

CREATE UNIQUE INDEX inventory_item_pkey ON public.inventory_item USING btree (id);

CREATE UNIQUE INDEX period_time_name_key ON public.period_time USING btree (name);

CREATE UNIQUE INDEX period_time_pkey ON public.period_time USING btree (id);

CREATE UNIQUE INDEX variant_inventory_item_acquisition_id_key ON public.variant_inventory_item USING btree (acquisition_id);

CREATE UNIQUE INDEX variant_inventory_item_pkey ON public.variant_inventory_item USING btree (id);

alter table "public"."acquisition" add constraint "acquisition_pkey" PRIMARY KEY using index "acquisition_pkey";

alter table "public"."catalog_item" add constraint "catalog_item_pkey" PRIMARY KEY using index "catalog_item_pkey";

alter table "public"."inventory_group" add constraint "inventory_group_pkey" PRIMARY KEY using index "inventory_group_pkey";

alter table "public"."inventory_item" add constraint "inventory_item_pkey" PRIMARY KEY using index "inventory_item_pkey";

alter table "public"."period_time" add constraint "period_time_pkey" PRIMARY KEY using index "period_time_pkey";

alter table "public"."variant_inventory_item" add constraint "variant_inventory_item_pkey" PRIMARY KEY using index "variant_inventory_item_pkey";

alter table "public"."acquisition" add constraint "acquisition_number_check" CHECK ((char_length(number) > 0)) not valid;

alter table "public"."acquisition" validate constraint "acquisition_number_check";

alter table "public"."acquisition" add constraint "acquisition_price_check" CHECK ((price >= (0)::numeric)) not valid;

alter table "public"."acquisition" validate constraint "acquisition_price_check";

alter table "public"."acquisition" add constraint "acquisition_type_check" CHECK ((type = ANY (ARRAY['Recibo'::text, 'Boleta'::text, 'Donación'::text]))) not valid;

alter table "public"."acquisition" validate constraint "acquisition_type_check";

alter table "public"."catalog_item" add constraint "catalog_item_name_key" UNIQUE using index "catalog_item_name_key";

alter table "public"."inventory_group" add constraint "inventory_group_name_period_key" UNIQUE using index "inventory_group_name_period_key";

alter table "public"."inventory_group" add constraint "inventory_group_period_fkey" FOREIGN KEY (period) REFERENCES period_time(id) ON DELETE CASCADE not valid;

alter table "public"."inventory_group" validate constraint "inventory_group_period_fkey";

alter table "public"."inventory_item" add constraint "inventory_item_catalog_item_id_fkey" FOREIGN KEY (catalog_item_id) REFERENCES catalog_item(id) ON DELETE CASCADE not valid;

alter table "public"."inventory_item" validate constraint "inventory_item_catalog_item_id_fkey";

alter table "public"."inventory_item" add constraint "inventory_item_group_id_fkey" FOREIGN KEY (group_id) REFERENCES inventory_group(id) ON DELETE CASCADE not valid;

alter table "public"."inventory_item" validate constraint "inventory_item_group_id_fkey";

alter table "public"."inventory_item" add constraint "inventory_item_total_check" CHECK ((total >= 0)) not valid;

alter table "public"."inventory_item" validate constraint "inventory_item_total_check";

alter table "public"."period_time" add constraint "period_time_name_key" UNIQUE using index "period_time_name_key";

alter table "public"."variant_inventory_item" add constraint "variant_inventory_item_acquisition_id_fkey" FOREIGN KEY (acquisition_id) REFERENCES acquisition(id) ON DELETE CASCADE not valid;

alter table "public"."variant_inventory_item" validate constraint "variant_inventory_item_acquisition_id_fkey";

alter table "public"."variant_inventory_item" add constraint "variant_inventory_item_acquisition_id_key" UNIQUE using index "variant_inventory_item_acquisition_id_key";

alter table "public"."variant_inventory_item" add constraint "variant_inventory_item_color_check" CHECK ((char_length(color) > 0)) not valid;

alter table "public"."variant_inventory_item" validate constraint "variant_inventory_item_color_check";

alter table "public"."variant_inventory_item" add constraint "variant_inventory_item_conservation_status_check" CHECK ((conservation_status = ANY (ARRAY['Bueno'::text, 'Regular'::text, 'Malo'::text]))) not valid;

alter table "public"."variant_inventory_item" validate constraint "variant_inventory_item_conservation_status_check";

alter table "public"."variant_inventory_item" add constraint "variant_inventory_item_count_check" CHECK ((count > 0)) not valid;

alter table "public"."variant_inventory_item" validate constraint "variant_inventory_item_count_check";

alter table "public"."variant_inventory_item" add constraint "variant_inventory_item_height_check" CHECK ((height >= (0)::numeric)) not valid;

alter table "public"."variant_inventory_item" validate constraint "variant_inventory_item_height_check";

alter table "public"."variant_inventory_item" add constraint "variant_inventory_item_inventory_item_id_fkey" FOREIGN KEY (inventory_item_id) REFERENCES inventory_item(id) ON DELETE CASCADE not valid;

alter table "public"."variant_inventory_item" validate constraint "variant_inventory_item_inventory_item_id_fkey";

alter table "public"."variant_inventory_item" add constraint "variant_inventory_item_length_check" CHECK ((length >= (0)::numeric)) not valid;

alter table "public"."variant_inventory_item" validate constraint "variant_inventory_item_length_check";

alter table "public"."variant_inventory_item" add constraint "variant_inventory_item_width_check" CHECK ((width >= (0)::numeric)) not valid;

alter table "public"."variant_inventory_item" validate constraint "variant_inventory_item_width_check";

set check_function_bodies = off;

create type "public"."acquisition_input" as ("type" text, "number" text, "date" date, "price" numeric);
create type "public"."group_input" as ("name" text, "description" text, "period" uuid);
create type "public"."variant_input" as ("color" text, "length" numeric, "width" numeric, "height" numeric, "serial_number" text, "brand" text, "model" text, "caracteristic" text, "conservation_status" text, "notes" text, "images" text[], "count" integer);

CREATE OR REPLACE FUNCTION public.add_variant_with_acquisition(_inventory_item_id uuid, _variant variant_input, _acquisition acquisition_input)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.delete_variants(item_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
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

CREATE OR REPLACE FUNCTION public.edit_group(inventory_group_id_to_edit uuid, group_value group_input)
 RETURNS inventory_group
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
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
$function$
;

create or replace view "public"."inventory_group_info" as  SELECT ig.id,
    ig.name,
    ig.description,
    ig.period,
    (COALESCE(sum(ii.total), (0)::bigint))::integer AS count
   FROM (inventory_group ig
     LEFT JOIN inventory_item ii ON ((ii.group_id = ig.id)))
  GROUP BY ig.id, ig.name, ig.description;


create or replace view "public"."inventory_item_summary" as  SELECT ii.id,
    ii.total,
    ci.id AS catalog_item_id,
    ci.name AS catalog_item_name
   FROM (inventory_item ii
     JOIN catalog_item ci ON ((ci.id = ii.catalog_item_id)));


CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  new.updated_at := now();
  return new;
end
$function$
;

CREATE OR REPLACE FUNCTION public.update_inventory_total()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.update_variant_with_acquisition(_inventory_item_id uuid, _variant variant_input, _acquisition acquisition_input)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
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
$function$
;

grant delete on table "public"."acquisition" to "anon";

grant insert on table "public"."acquisition" to "anon";

grant references on table "public"."acquisition" to "anon";

grant select on table "public"."acquisition" to "anon";

grant trigger on table "public"."acquisition" to "anon";

grant truncate on table "public"."acquisition" to "anon";

grant update on table "public"."acquisition" to "anon";

grant delete on table "public"."acquisition" to "authenticated";

grant insert on table "public"."acquisition" to "authenticated";

grant references on table "public"."acquisition" to "authenticated";

grant select on table "public"."acquisition" to "authenticated";

grant trigger on table "public"."acquisition" to "authenticated";

grant truncate on table "public"."acquisition" to "authenticated";

grant update on table "public"."acquisition" to "authenticated";

grant delete on table "public"."acquisition" to "service_role";

grant insert on table "public"."acquisition" to "service_role";

grant references on table "public"."acquisition" to "service_role";

grant select on table "public"."acquisition" to "service_role";

grant trigger on table "public"."acquisition" to "service_role";

grant truncate on table "public"."acquisition" to "service_role";

grant update on table "public"."acquisition" to "service_role";

grant delete on table "public"."catalog_item" to "anon";

grant insert on table "public"."catalog_item" to "anon";

grant references on table "public"."catalog_item" to "anon";

grant select on table "public"."catalog_item" to "anon";

grant trigger on table "public"."catalog_item" to "anon";

grant truncate on table "public"."catalog_item" to "anon";

grant update on table "public"."catalog_item" to "anon";

grant delete on table "public"."catalog_item" to "authenticated";

grant insert on table "public"."catalog_item" to "authenticated";

grant references on table "public"."catalog_item" to "authenticated";

grant select on table "public"."catalog_item" to "authenticated";

grant trigger on table "public"."catalog_item" to "authenticated";

grant truncate on table "public"."catalog_item" to "authenticated";

grant update on table "public"."catalog_item" to "authenticated";

grant delete on table "public"."catalog_item" to "service_role";

grant insert on table "public"."catalog_item" to "service_role";

grant references on table "public"."catalog_item" to "service_role";

grant select on table "public"."catalog_item" to "service_role";

grant trigger on table "public"."catalog_item" to "service_role";

grant truncate on table "public"."catalog_item" to "service_role";

grant update on table "public"."catalog_item" to "service_role";

grant delete on table "public"."inventory_group" to "anon";

grant insert on table "public"."inventory_group" to "anon";

grant references on table "public"."inventory_group" to "anon";

grant select on table "public"."inventory_group" to "anon";

grant trigger on table "public"."inventory_group" to "anon";

grant truncate on table "public"."inventory_group" to "anon";

grant update on table "public"."inventory_group" to "anon";

grant delete on table "public"."inventory_group" to "authenticated";

grant insert on table "public"."inventory_group" to "authenticated";

grant references on table "public"."inventory_group" to "authenticated";

grant select on table "public"."inventory_group" to "authenticated";

grant trigger on table "public"."inventory_group" to "authenticated";

grant truncate on table "public"."inventory_group" to "authenticated";

grant update on table "public"."inventory_group" to "authenticated";

grant delete on table "public"."inventory_group" to "service_role";

grant insert on table "public"."inventory_group" to "service_role";

grant references on table "public"."inventory_group" to "service_role";

grant select on table "public"."inventory_group" to "service_role";

grant trigger on table "public"."inventory_group" to "service_role";

grant truncate on table "public"."inventory_group" to "service_role";

grant update on table "public"."inventory_group" to "service_role";

grant delete on table "public"."inventory_item" to "anon";

grant insert on table "public"."inventory_item" to "anon";

grant references on table "public"."inventory_item" to "anon";

grant select on table "public"."inventory_item" to "anon";

grant trigger on table "public"."inventory_item" to "anon";

grant truncate on table "public"."inventory_item" to "anon";

grant update on table "public"."inventory_item" to "anon";

grant delete on table "public"."inventory_item" to "authenticated";

grant insert on table "public"."inventory_item" to "authenticated";

grant references on table "public"."inventory_item" to "authenticated";

grant select on table "public"."inventory_item" to "authenticated";

grant trigger on table "public"."inventory_item" to "authenticated";

grant truncate on table "public"."inventory_item" to "authenticated";

grant update on table "public"."inventory_item" to "authenticated";

grant delete on table "public"."inventory_item" to "service_role";

grant insert on table "public"."inventory_item" to "service_role";

grant references on table "public"."inventory_item" to "service_role";

grant select on table "public"."inventory_item" to "service_role";

grant trigger on table "public"."inventory_item" to "service_role";

grant truncate on table "public"."inventory_item" to "service_role";

grant update on table "public"."inventory_item" to "service_role";

grant delete on table "public"."period_time" to "anon";

grant insert on table "public"."period_time" to "anon";

grant references on table "public"."period_time" to "anon";

grant select on table "public"."period_time" to "anon";

grant trigger on table "public"."period_time" to "anon";

grant truncate on table "public"."period_time" to "anon";

grant update on table "public"."period_time" to "anon";

grant delete on table "public"."period_time" to "authenticated";

grant insert on table "public"."period_time" to "authenticated";

grant references on table "public"."period_time" to "authenticated";

grant select on table "public"."period_time" to "authenticated";

grant trigger on table "public"."period_time" to "authenticated";

grant truncate on table "public"."period_time" to "authenticated";

grant update on table "public"."period_time" to "authenticated";

grant delete on table "public"."period_time" to "service_role";

grant insert on table "public"."period_time" to "service_role";

grant references on table "public"."period_time" to "service_role";

grant select on table "public"."period_time" to "service_role";

grant trigger on table "public"."period_time" to "service_role";

grant truncate on table "public"."period_time" to "service_role";

grant update on table "public"."period_time" to "service_role";

grant delete on table "public"."variant_inventory_item" to "anon";

grant insert on table "public"."variant_inventory_item" to "anon";

grant references on table "public"."variant_inventory_item" to "anon";

grant select on table "public"."variant_inventory_item" to "anon";

grant trigger on table "public"."variant_inventory_item" to "anon";

grant truncate on table "public"."variant_inventory_item" to "anon";

grant update on table "public"."variant_inventory_item" to "anon";

grant delete on table "public"."variant_inventory_item" to "authenticated";

grant insert on table "public"."variant_inventory_item" to "authenticated";

grant references on table "public"."variant_inventory_item" to "authenticated";

grant select on table "public"."variant_inventory_item" to "authenticated";

grant trigger on table "public"."variant_inventory_item" to "authenticated";

grant truncate on table "public"."variant_inventory_item" to "authenticated";

grant update on table "public"."variant_inventory_item" to "authenticated";

grant delete on table "public"."variant_inventory_item" to "service_role";

grant insert on table "public"."variant_inventory_item" to "service_role";

grant references on table "public"."variant_inventory_item" to "service_role";

grant select on table "public"."variant_inventory_item" to "service_role";

grant trigger on table "public"."variant_inventory_item" to "service_role";

grant truncate on table "public"."variant_inventory_item" to "service_role";

grant update on table "public"."variant_inventory_item" to "service_role";

CREATE TRIGGER trg_set_updated_at_inventory_group BEFORE UPDATE ON public.inventory_group FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_set_updated_at_inventory_item BEFORE UPDATE ON public.inventory_item FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_set_updated_at_variant_item BEFORE UPDATE ON public.variant_inventory_item FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_update_total_after_delete AFTER DELETE ON public.variant_inventory_item FOR EACH ROW EXECUTE FUNCTION update_inventory_total();

CREATE TRIGGER trg_update_total_after_insert AFTER INSERT ON public.variant_inventory_item FOR EACH ROW EXECUTE FUNCTION update_inventory_total();

CREATE TRIGGER trg_update_total_after_update AFTER UPDATE ON public.variant_inventory_item FOR EACH ROW EXECUTE FUNCTION update_inventory_total();


