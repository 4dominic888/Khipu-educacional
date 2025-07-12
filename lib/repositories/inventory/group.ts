import { RepositoryFull } from "@/lib/interfaces/repository";
import { Result, QueryParams } from "@/types/helpers";
import { InventoryGroup, InventoryGroupEditable, InventoryGroupInfo } from "@/types/khipu/inventory.types";
import { Pool, PoolClient } from "pg";

export class GroupInventoryRepository implements RepositoryFull<InventoryGroup, InventoryGroupInfo, InventoryGroupEditable> {

    constructor(readonly db: Pool | PoolClient) {}

    async add(data: InventoryGroupEditable): Promise<Result<InventoryGroup, string>> {
        throw new Error("Method not implemented.");
    }

    async update(data: InventoryGroup): Promise<Result<InventoryGroup, string>> {
        throw new Error("Method not implemented.");
    }

    async remove(id: string): Promise<Result<null, string>> {
        throw new Error("Method not implemented.");
    }

    async get(id: string): Promise<InventoryGroup | null> {
        throw new Error("Method not implemented.");
    }

    async getAllSummary(query?: QueryParams<InventoryGroup> | undefined): Promise<InventoryGroupInfo[]> {
        throw new Error("Method not implemented.");
    }

    async getAll(query?: QueryParams<InventoryGroup> | undefined): Promise<InventoryGroup[]> {
        throw new Error("Method not implemented.");
    }
}