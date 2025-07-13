import { QueryParamsToSql } from "@/lib/db";
import { RepositorySimpleWithAddAll } from "@/lib/interfaces/repository";
import { runQuery } from "@/lib/utils";
import { Result, QueryParams, success, failure } from "@/types/helpers";
import { CatalogItem } from "@/types/khipu/inventory.types";
import { Pool, PoolClient } from "pg";

export class CatalogInventoryRepository implements RepositorySimpleWithAddAll<CatalogItem> {

    constructor(readonly db: Pool | PoolClient) {} 

    async add(data: CatalogItem): Promise<Result<CatalogItem, string>> {
        return runQuery<CatalogItem>({
            db: this.db,
            query: 'INSERT INTO catalog_item (id, name) VALUES ($1, $2) RETURNING *',
            params: [data.id, data.name],
            errorMessage: 'No se ha agregado el catalogo'
        });
    }

    async addAll(data: CatalogItem[]): Promise<Result<undefined, string>> {
        if (data.length === 0) return failure('No hay datos a agregar');
        const values: string[] = [];
        const placeholders: string[] = [];

        data.forEach(({ id, name }, i) => {
            const idx = i * 2;
            placeholders.push(`($${idx + 1}, $${idx + 2})`);
            values.push(id, name);
        });

        const query = `INSERT INTO catalog_item (id, name) VALUES ${placeholders.join(', ')}`;
        try {
            await this.db.query(query, values);
            return success(undefined);
        } catch (error) {
            console.log(error);
            return failure('Ocurrió un error inesperado');
        }
    }

    async update(data: CatalogItem): Promise<Result<CatalogItem, string>> {
        return runQuery<CatalogItem>({
            db: this.db,
            query: 'UPDATE catalog_item SET id = $1, name = $2 WHERE id = $3 RETURNING *',
            params: [data.id, data.name, data.id],
            errorMessage: 'No se ha actualizado este elemento del catalogo'
        });
    }

    async remove(id: string): Promise<Result<null, string>> {
        const result = await runQuery({
            db: this.db,
            query: 'DELETE FROM catalog_item WHERE id = $1 RETURNING *',
            params: [id],
            errorMessage: 'No se ha eliminado el elemento del catalogo'
        });

        return result.ok ? success(null) : failure('No se ha eliminado el elemento del catalogo');
    }

    async get(id: string): Promise<CatalogItem | null> {
        const result = await runQuery<CatalogItem>({
            db: this.db,
            query: 'SELECT * FROM catalog_item WHERE id = $1',
            params: [id],
            errorMessage: 'No se ha encontrado el elemento'
        });

        return result.value;
    }

    async getAll(query?: QueryParams<CatalogItem> | undefined): Promise<CatalogItem[]> {
        const { sql, values } = QueryParamsToSql<CatalogItem>({
            query: query ?? {
                sort: [{ field: 'name', direction: 'asc' }],
                pagination: { page: 1, pageSize: 20 }
            },
            selectFields: 'id, name',
            tableName: 'catalog_item'
        });

        const { rows } = await this.db.query<CatalogItem>(sql, values);
        return rows;
    }
}