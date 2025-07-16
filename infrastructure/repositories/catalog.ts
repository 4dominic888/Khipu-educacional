import { CatalogItem } from "@/core/domain";
import { CatalogItemRepository } from "@/core/ports/repositories/inventory";
import { Result, QueryParams, success, failure } from "@/core/shared";
import { PostgresRepositoryBase } from "@/infrastructure/shared/extra";
import { Pool, PoolClient } from "pg";
import * as pgdbu from "@/infrastructure/shared/db";

export class PostgresCatalogItemRepository implements CatalogItemRepository, PostgresRepositoryBase {

    constructor(readonly db: Pool | PoolClient) {};

    async count(): Promise<Result<number, string>> {
        try {
            const { rows } = await this.db.query('SELECT COUNT(*) FROM catalog_item');
            return success(parseInt(rows[0].count ?? '0'));
        }
        catch (error) {
            console.log(error);
            return failure('Ocurrió un error inesperado');
        }
    }

    async add(data: CatalogItem): Promise<Result<CatalogItem, string>> {
        return pgdbu.runQuery<CatalogItem>({
            db: this.db,
            query: 'INSERT INTO catalog_item (id, name) VALUES ($1, $2) RETURNING *',
            params: [data.id, data.name],
            errorMessage: 'No se ha agregado el catalogo'
        });
    }

    async update(data: CatalogItem): Promise<Result<CatalogItem, string>> {
        return pgdbu.runQuery<CatalogItem>({
            db: this.db,
            query: 'UPDATE catalog_item SET id = $1, name = $2 WHERE id = $3 RETURNING *',
            params: [data.id, data.name, data.id],
            errorMessage: 'No se ha actualizado este elemento del catalogo'
        });
    }

    async remove(id: string): Promise<Result<string, string>> {
        const result = await pgdbu.runQuery<CatalogItem>({
            db: this.db,
            query: 'DELETE FROM catalog_item WHERE id = $1 RETURNING *',
            params: [id],
            errorMessage: 'No se ha eliminado el elemento del catalogo'
        });

        return result.ok ? success(result.value.id, 'Eliminación exitosa') : failure('No se ha eliminado el elemento del catalogo');
    }

    async get(id: string): Promise<CatalogItem | null> {
        const result = await pgdbu.runQuery<CatalogItem>({
            db: this.db,
            query: 'SELECT * FROM catalog_item WHERE id = $1',
            params: [id],
            errorMessage: 'No se ha encontrado el elemento'
        });

        return result.value;
    }
    
    async getAll(query?: QueryParams<CatalogItem> | undefined): Promise<CatalogItem[]> {
        const { sql, values } = pgdbu.selectQueryParamsToSql<CatalogItem>({
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

    async addAll(data: CatalogItem[]): Promise<Result<number, string>> {
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
            const { rowCount } = await this.db.query(query, values);
            return success(rowCount ?? 0);
        } catch (error) {
            console.log(error);
            return failure('Ocurrió un error inesperado');
        }
    }

    async removeAll(ids: string[]): Promise<Result<number, string>> {
        try {
            const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ');
            const query = `DELETE FROM catalog_item WHERE id IN (${placeholders})`;
            const { rowCount } = await this.db.query(query, ids);
            return success(rowCount ?? 0, "Eliminación exitosa");
        }
        catch (error) {
            console.log(error);
            return failure('Ocurrió un error inesperado');
        }
    }

    async removeEverything(): Promise<Result<number, string>> {
        try {
            const { rowCount } = await this.db.query('DELETE FROM catalog_item');
            return success(rowCount ?? 0, "Eliminación exitosa");
        }
        catch (error) {
            console.log(error);
            return failure('Ocurrió un error inesperado');
        }
    }
}