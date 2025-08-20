set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.remove_everything_catalogs(dry_run boolean DEFAULT false)
 RETURNS integer
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
    deleted_count integer := 0;
begin
    begin
        delete from catalog_item where id != '';
        get diagnostics deleted_count = row_count;

        if dry_run then
            raise notice 'Dry-run activado: % filas habrian sido eliminadas', deleted_count;
        end if;

    exception
        when others then
            RAISE NOTICE 'Dry-run: % filas habrían sido eliminadas', deleted_count;
            deleted_count := deleted_count;

    end;
    return deleted_count;
end;
$function$
;


