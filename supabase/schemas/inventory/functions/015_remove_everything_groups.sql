create or replace function public.remove_everything_groups(dry_run boolean DEFAULT false)
    returns integer
    language plpgsql
    set search_path = ''
as $$
declare
    deleted_count integer := 0;
begin
    begin
        delete from inventory_group where id != '';
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
$$;