import { InventoryGroup, InventoryGroupEditable, InventoryGroupInfo, InventoryGroupToAdd } from "@/core/domain";
import { InventoryGroupRepository } from "@/core/ports/repositories/inventory";
import { Result, QueryParams } from "@/core/shared";
import { Pool, PoolClient } from "pg";
import * as pgdbu from "@/infrastructure/shared/db";
import { success, failure } from "@/core/shared";

export class PostgresInventoryGroupRepository implements InventoryGroupRepository {
    constructor(readonly db: Pool | PoolClient) {}

    async count(): Promise<Result<number, string>> {
        try {
            const { rows } = await this.db.query('SELECT COUNT(*) FROM inventory_group');
            return success(parseInt(rows[0].count ?? '0'));
        }
        catch (error) {
            console.log(error);
            return failure('Ocurrió un error inesperado');
        }
    }

    async updateInformation(group: InventoryGroupEditable): Promise<Result<InventoryGroup, string>> {
        return await pgdbu.runUpdateQuery<InventoryGroupEditable, InventoryGroup>({
            db: this.db,
            tableName: 'inventory_group',
            keyField: 'id',
            data: group,
            errorMessage: 'No se ha actualizado el grupo'
        });
    }

    async add(data: InventoryGroupToAdd): Promise<Result<InventoryGroup, string>> {
        const result = await pgdbu.runQuery<InventoryGroup>({
            db: this.db,
            query: `INSERT INTO inventory_group (name, description, period) VALUES ($1, $2, $3) RETURNING *`,
            params: [data.name, data.description, data.period],
            errorMessage: 'No se ha creado correctamente el grupo'
        });

        if(!result.ok) return failure(result.error);

        const groupCreated : InventoryGroup = {
            id: result.value.id,
            name: result.value.name,
            description: result.value.description,
            items: [],
            period: result.value.period,
        };

        return success(groupCreated);
    }

    async remove(id: string): Promise<Result<string, string>> {
        const result = await pgdbu.runQuery({
            db: this.db,
            query: 'DELETE FROM inventory_group WHERE id = $1 RETURNING *',
            params: [id],
            errorMessage: 'No se ha eliminado correctamente el grupo'
        });

        return result.ok ? success(result.value.id, 'Eliminación exitosa') : failure(result.error);
    }

    async get(id: string): Promise<InventoryGroup | null> {
        const result = await pgdbu.runQuery<InventoryGroup>({
            db: this.db,
            query: 'SELECT * FROM inventory_group WHERE id = $1',
            params: [id],
            errorMessage: 'No se ha encontrado el grupo'
        });

        return result.value;
    }

    async getAll(query?: QueryParams<InventoryGroup> | undefined): Promise<InventoryGroup[]> {
        const { sql, values } = pgdbu.selectQueryParamsToSql<InventoryGroup>({
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

    async getAllSummary(query?: QueryParams<InventoryGroup> | undefined): Promise<InventoryGroupInfo[]> {
        const { sql, values } = pgdbu.selectQueryParamsToSql<InventoryGroup>({
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

    async removeAll(ids: string[]): Promise<Result<number, string>> {
        try {
            const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ');
            const query = `DELETE FROM inventory_group WHERE id IN (${placeholders})`;
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
            const { rowCount } = await this.db.query('DELETE FROM inventory_group');
            return success(rowCount ?? 0, "Eliminación exitosa");
        }
        catch (error) {
            console.log(error);
            return failure('Ocurrió un error inesperado');
        }
    }

    async duplicate(id: string): Promise<Result<string, string>> {
        try {
            //* Obtener el grupo a copiar
            const group = await this.get(id);
            if (!group) return failure('No se ha encontrado el grupo');

            //* Buscar algun otro grupo con el mismo nombre, teniendo en cuenta el periodo
            const foundDuplicates = await this.getAllSummary(
                {
                    filter: {
                        AND: [
                            { name: { op: 'contains', value: group.name } },
                            { period: { op: 'eq', value: group.period } }
                        ]
                    }
                }
            );

            const existingNames = foundDuplicates.map((g) => g.name);
            let copyNumber = 1;

            while (existingNames.includes(`${group.name} (${copyNumber})`)) copyNumber++;
            const newName = `${group.name} (${copyNumber})`;

            const result = await this.add({
                name: newName,
                description: group.description,
                period: group.period
            });
            
            return result.ok ? success(result.value.id, 'Duplicación exitosa') : failure(result.error);
        }
        catch (error) {
            console.log(error);
            return failure('Ocurrió un error inesperado');
        }
    }
}