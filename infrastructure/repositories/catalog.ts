import { CatalogItem } from "@/core/domain";
import { CatalogItemRepository } from "@/core/ports/repositories/inventory";
import { Result, QueryParams, success, failure } from "@/core/shared";
import { supabaseClient as spc } from "../shared/supabase-client";
import { buildQueryFromParams } from "../shared/supabase-extra";

export class PostgresCatalogItemRepository implements CatalogItemRepository {

    async count(): Promise<Result<number, string>> {
        const { count, error } = await spc.from('catalog_item').select('*', { count: 'exact', head: true });
        if (error) {
            console.log(error);
            return failure(error.message);
        }
        if(!count) return failure('Ha ocurrido un error inesperado');
        return success(count);
    }

    async add(data: CatalogItem): Promise<Result<CatalogItem, string>> {
        const { data: catalogItem, error } = await spc.from('catalog_item').insert(data).select().single();
        if (error) {
            console.log(error);
            return failure(error.message);
        }
        return success(catalogItem);
    }

    async update(data: CatalogItem): Promise<Result<CatalogItem, string>> {
        const { data: catalogItem, error } = await spc.from('catalog_item').update(data).eq('id', data.id).select().single();
        if (error) {
            console.log(error);
            return failure(error.message);
        }
        return success(catalogItem);
    }

    async remove(id: string): Promise<Result<string, string>> {
        const { data, error } = await spc.from('catalog_item').delete().eq('id', id).select().single();
        if (error) {
            console.log(error);
            return failure(error.message);
        }
        return success(data.id);
    }

    async get(id: string): Promise<CatalogItem | null> {
        const { data, error } = await spc.from('catalog_item').select().eq('id', id).single();
        if (error) {
            console.log(error);
        }        
        return error ? null : data;
    }
    
    async getAll(query?: QueryParams<CatalogItem> | undefined): Promise<CatalogItem[]> {
        const supabaseQuery = spc.from('catalog_item').select('*', { count: 'exact' });
        
        const structuredQuery = buildQueryFromParams<CatalogItem>(
            supabaseQuery,
            query ?? {
                sort: [{ field: 'name', direction: 'asc' }],
                pagination: { page: 1, pageSize: 20 }
            },
        );
        const { data, error } = await structuredQuery;
        if (error) {
            console.log(error);
            return [];
        }
        return data;
    }

    async addAll(data: CatalogItem[]): Promise<Result<number, string>> {
        const { count, error } = await spc.from('catalog_item').insert(data).select();
        if (error) {
            console.log(error);
            return failure(error.message);
        }
        if(!count) return failure('Ha ocurrido un error inesperado');
        return success(count);
    }

    async removeAll(ids: string[]): Promise<Result<number, string>> {
        const { count, error } = await spc.from('catalog_item').delete().in('id', ids);
        if (error) {
            console.log(error);
            return failure(error.message);
        }
        if(!count) return failure('Ha ocurrido un error inesperado');
        return success(count);
    }

    async removeEverything(): Promise<Result<number, string>> {
        const { count, error } = await spc.from('catalog_item').delete();
        if (error) {
            console.log(error);
            return failure(error.message);
        }
        if(!count) return failure('Ha ocurrido un error inesperado');
        return success(count);
    }
}