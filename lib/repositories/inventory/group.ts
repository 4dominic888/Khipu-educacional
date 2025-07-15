import { SelectQueryParamsToSql } from "@/lib/db";
import { RepositoryFull } from "@/lib/interfaces/repository";
import { runQuery } from "@/lib/utils";
import { Result, QueryParams, success, failure } from "@/types/helpers";
import { InventoryGroup, InventoryGroupEditable, InventoryGroupInfo, InventoryItem } from "@/types/khipu/inventory.types";
import { Pool, PoolClient } from "pg";

export class GroupInventoryRepository implements RepositoryFull<InventoryGroup, InventoryGroupInfo, InventoryGroupEditable> {

    constructor(readonly db: Pool | PoolClient) {}

    async add(data: InventoryGroupEditable): Promise<Result<InventoryGroup, string>> {
        const placeholder : string = !data.description ? "(name) VALUES ($1)" : "(name, description) VALUES ($1, $2)";
        const paramsData : any[] = !data.description ? [data.name] : [data.name, data.description];

        const result = await runQuery<InventoryGroup>({
            db: this.db,
            query: `INSERT INTO inventory_group ${placeholder} RETURNING *`,
            params: paramsData,
            errorMessage: 'No se ha creado correctamente el grupo'
        });

        return result.ok ? success({
            id: result.value.id,
            name: result.value.name,
            description: result.value.description,
            update_at: result.value.update_at,
            items: [],
        }) : failure(result.error);
    }

    async update(data: InventoryGroup): Promise<Result<InventoryGroup, string>> {

        const placeholder : string = !data.description ? "name = $1" : "name = $1, description = $2"; 
        const paramsData : any[] = !data.description ? [data.name] : [data.name, data.description];

        return runQuery<InventoryGroup>({
            db: this.db,
            query: `UPDATE inventory_group SET ${placeholder} WHERE id = $3 RETURNING *`,
            params: [...paramsData, data.id],
            errorMessage: 'No se ha actualizado correctamente el grupo'
        });
    }

    async remove(id: string): Promise<Result<null, string>> {
        const result = await runQuery({
            db: this.db,
            query: 'DELETE FROM inventory_group WHERE id = $1 RETURNING *',
            params: [id],
            errorMessage: 'No se ha eliminado correctamente el grupo'
        });

        return result.ok ? success(null, 'Eliminación exitosa') : failure(result.error);
    }

    async get(id: string): Promise<InventoryGroup | null> {
        const result = await runQuery<InventoryGroup>({
            db: this.db,
            query: 'SELECT * FROM inventory_group WHERE id = $1',
            params: [id],
            errorMessage: 'No se ha encontrado el grupo'
        });

        return result.value;
    }

    async getAllSummary(query?: QueryParams<InventoryGroup> | undefined): Promise<InventoryGroupInfo[]> {
        const { sql, values } = SelectQueryParamsToSql<InventoryGroup>({
            query: query ?? {
                sort: [{ field: 'name', direction: 'asc' }],
                pagination: { page: 1, pageSize: 20 }
            },
            selectFields: '*',
            tableName: 'inventory_group_info'
        });

        const { rows } = await this.db.query<InventoryGroupInfo>(sql, values);
        return rows;
    }

    async getAll(query?: QueryParams<InventoryGroup> | undefined): Promise<InventoryGroup[]> {
        const { sql, values } = SelectQueryParamsToSql<InventoryGroup>({
            query: query ?? {
                sort: [{ field: 'name', direction: 'asc' }],
                pagination: { page: 1, pageSize: 20 }
            },
            selectFields: '*',
            tableName: 'inventory_group'
        });

        const { rows } = await this.db.query<InventoryGroup>(sql, values);
        return rows;
    }
}