import { CatalogItem } from "@/core/domain";
import { CatalogItemRepository } from "@/core/ports/repositories/inventory";
import { Result, QueryParams, success, failure } from "@/core/shared";
import { supabaseClient as supaClient } from "../shared/supabase-client";
import { buildQueryFromParams } from "../shared/supabase-extra";
import { logger, LogMethod } from "../shared/logger";
import { postgreDefaultErrorMessage } from "../shared/postgre-error-messages";

export class PostgreCatalogItemRepository implements CatalogItemRepository {

    @LogMethod()
    async count(): Promise<Result<number, string>> {
        const { count, error } = await supaClient.from('catalog_item').select('*', { count: 'exact', head: true });
        if (error) {
            logger.error('Error counting catalog items', error);
            return failure(postgreDefaultErrorMessage(error.code));
        }
        if(!count) {
            logger.error('count is not defined and could be null', { countValue: count });
            return failure('No se pudo obtener el número de elementos del catálogo');
        }
        return success(count);
    }

    @LogMethod()
    async add(data: CatalogItem): Promise<Result<CatalogItem, string>> {
        const { data: catalogItem, error } = await supaClient.from('catalog_item').insert(data).select().single();
        if (error) {
            logger.error('Error adding catalog item', error);

            if(error.code === '23505') return failure("No se puede usar el mismo id o nombre de un elemento del catálogo");
            return failure(postgreDefaultErrorMessage(error.code));
        }
        return success(catalogItem);
    }

    @LogMethod()
    async update(data: CatalogItem): Promise<Result<CatalogItem, string>> {

        const { data: catalogItem, error } = await supaClient.from('catalog_item').update(data).eq('id', data.id).select().single();
        if (error) {
            logger.error('Error updating catalog item', error);
            return failure(postgreDefaultErrorMessage(error.code));
        }
        return success(catalogItem);
    }

    @LogMethod()
    async remove(id: string): Promise<Result<string, string>> {
        const { data, error } = await supaClient.from('catalog_item').delete().eq('id', id).select('id').single();
        if (error) {
            logger.error('Error removing catalog item', error);
            return failure(postgreDefaultErrorMessage(error.code));
        }
        return success(data.id);
    }

    @LogMethod()
    async get(id: string): Promise<CatalogItem | null> {
        const { data, error } = await supaClient.from('catalog_item').select().eq('id', id).single();
        if (error) logger.error('Error getting catalog item', error);
        return error ? null : data;
    }
    
    @LogMethod()
    async getAll(query?: QueryParams<CatalogItem> | undefined): Promise<CatalogItem[]> {
        const supabaseQuery = supaClient.from('catalog_item').select('*', { count: 'exact' });
        
        const structuredQuery = buildQueryFromParams<CatalogItem>(
            supabaseQuery,
            query ?? {
                sort: [{ field: 'name', direction: 'asc' }],
                pagination: { page: 1, pageSize: 20 }
            },
        );
        const { data, error } = await structuredQuery;
        if (error) {
            logger.error('Error getting catalog items', error);
            return [];
        }
        return data;
    }

    @LogMethod()
    async addAll(data: CatalogItem[]): Promise<Result<number, string>> {
        const { count, error } = await supaClient.from('catalog_item').insert(data).select();
        if (error) {
            logger.error('Error adding many catalog items', error);
            return failure(postgreDefaultErrorMessage(error.code));
        }
        if(!count) {
            logger.error('the quantity of items added is not defined and could be null', { countValue: count });
            return failure("No se han podido añadir los elementos al catálogo");
        }
        return success(count);
    }

    @LogMethod()
    async removeAll(ids: string[]): Promise<Result<number, string>> {
        const { count, error } = await supaClient.from('catalog_item').delete().in('id', ids);
        if (error) {
            logger.error('Error removing many catalog items', error);
            return failure(postgreDefaultErrorMessage(error.code));
        }
        if(!count) {
            logger.error('the quantity of items removed is not defined and could be null', { countValue: count });
            return failure("No se han podido eliminar los elementos del catálogo");
        }
        return success(count);
    }

    @LogMethod()
    async removeEverything(): Promise<Result<number, string>> {
        const { count, error } = await supaClient.from('catalog_item').delete();
        if (error) {
            logger.error('Error removing all catalog items', error);
            return failure(postgreDefaultErrorMessage(error.code));
        }
        if(!count) {
            logger.error('the quantity of items removed is not defined and could be null', { countValue: count });
            return failure("No se han podido eliminar todos los elementos del catálogo");
        }
        return success(count);
    }
}