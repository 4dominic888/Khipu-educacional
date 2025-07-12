import { RepositorySimple } from "@/lib/interfaces/repository";
import { Result, QueryParams, success, failure } from "@/types/helpers";
import { CatalogItem } from "@/types/khipu/inventory.types";
import { Pool, PoolClient } from "pg";

export class CatalogInventoryRepository implements RepositorySimple<CatalogItem> {

    constructor(readonly db: Pool | PoolClient) {} 

    async add(data: CatalogItem): Promise<Result<CatalogItem, string>> {
        try {
            const { rows, rowCount } = await this.db.query<CatalogItem>(
                'INSERT INTO catalog_item (id, name) VALUES ($1, $2) RETURNING *',
                [data.id, data.name]
            );
    
            if (!rowCount) return failure('No se ha agregado el catalogo');
            
            return success(rows[0]);
        } catch (error) {
            console.log(error);
            return failure('Error al agregar el catalogo');
        }
    }

    async update(data: CatalogItem): Promise<Result<CatalogItem, string>> {
        throw new Error("Method not implemented.");
    }

    async remove(id: string): Promise<Result<null, string>> {
        throw new Error("Method not implemented.");
    }

    async get(id: string): Promise<CatalogItem | null> {
        throw new Error("Method not implemented.");
    }

    async getAll(query?: QueryParams<CatalogItem> | undefined): Promise<CatalogItem[]> {
        throw new Error("Method not implemented.");
    }
}