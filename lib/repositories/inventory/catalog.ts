import { SelectQueryParamsToSql } from "@/lib/db";
import { RepositorySimpleWithAddAllAndRemoveAll } from "@/lib/interfaces/repository";
import { runQuery } from "@/lib/utils";
import { Result, QueryParams, success, failure } from "@/types/helpers";
import { CatalogItem } from "@/types/khipu/inventory.types";
import { Pool, PoolClient } from "pg";

export class CatalogInventoryRepository implements RepositorySimpleWithAddAllAndRemoveAll<CatalogItem> {

    constructor(readonly db: Pool | PoolClient) {} 

    /**
     * Agrega un nuevo elemento al catalogo
     * @param data CatalogItem
     * @returns Un ´Result´ con el mismo catálogo si la operación tuvo éxito, o un mensaje de error si no.
     */
    async add(data: CatalogItem): Promise<Result<CatalogItem, string>> {
        return runQuery<CatalogItem>({
            db: this.db,
            query: 'INSERT INTO catalog_item (id, name) VALUES ($1, $2) RETURNING *',
            params: [data.id, data.name],
            errorMessage: 'No se ha agregado el catalogo'
        });
    }

    /**
     * Agrega varios nuevos elementos al catalogo
     * @param data Array de CatalogItem
     * @returns Un ´Result´ sin más, el dato no tiene relevancia, o un mensaje de error si no.
     */
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

    /**
     * Actualiza un elemento del catalogo
     * @param data CatalogItem
     * @returns Un ´Result´ con el mismo catálogo si la operación tuvo éxito, o un mensaje de error si no.
     */
    async update(data: CatalogItem): Promise<Result<CatalogItem, string>> {
        return runQuery<CatalogItem>({
            db: this.db,
            query: 'UPDATE catalog_item SET id = $1, name = $2 WHERE id = $3 RETURNING *',
            params: [data.id, data.name, data.id],
            errorMessage: 'No se ha actualizado este elemento del catalogo'
        });
    }

    /**
     * Elimina un elemento del catalogo
     * @param id Identificador del elemento a eliminar
     * @returns Un ´Result´ sin más, el dato no tiene relevancia, o un mensaje de error si no.
     */
    async remove(id: string): Promise<Result<null, string>> {
        const result = await runQuery({
            db: this.db,
            query: 'DELETE FROM catalog_item WHERE id = $1 RETURNING *',
            params: [id],
            errorMessage: 'No se ha eliminado el elemento del catalogo'
        });

        return result.ok ? success(null, 'Eliminación exitosa') : failure('No se ha eliminado el elemento del catalogo');
    }

    /**
     * Elimina un conjunto de elemento del catalogo.
     * @param ids El conjunto de identificadores de los elementos a eliminar.
     * @returns Un ´Result´ sin más, el dato no tiene relevancia, o un mensaje de error si no.
     */
    async removeAll(ids: string[]): Promise<Result<null, string>> {
        try {
            const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ');
            const query = `DELETE FROM catalog_item WHERE id IN (${placeholders})`;
            await this.db.query(query, ids);
            return success(null, "Eliminación exitosa");
        }
        catch (error) {
            console.log(error);
            return failure('Ocurrió un error inesperado');
        }
    }

    /**
     * Elimina todos los elementos del catalogo.
     * @returns Un ´Result´ sin más, el dato no tiene relevancia, o un mensaje de error si no.
     */
    async removeEverything(): Promise<Result<null, string>> {
        try {
            await this.db.query('DELETE FROM catalog_item');
            return success(null, "Eliminación exitosa");
        }
        catch (error) {
            console.log(error);
            return failure('Ocurrió un error inesperado');
        }
    }

    /**
     * Obtiene un elemento del catalogo por su identificador.
     * @param id Identificador del elemento a obtener.
     * @returns El elemento con la identificador especificada, o `null` si no se encuentra.
     */
    async get(id: string): Promise<CatalogItem | null> {
        const result = await runQuery<CatalogItem>({
            db: this.db,
            query: 'SELECT * FROM catalog_item WHERE id = $1',
            params: [id],
            errorMessage: 'No se ha encontrado el elemento'
        });

        return result.value;
    }

    /**
     * Obtiene todos los elementos del catalogo.
     * @param query Parametros de búsqueda opcionales.
     * @returns Un array de todos los elementos del catalogo.
     */
    async getAll(query?: QueryParams<CatalogItem> | undefined): Promise<CatalogItem[]> {
        const { sql, values } = SelectQueryParamsToSql<CatalogItem>({
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