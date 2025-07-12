import { InventoryItem, InventoryItemEditable, InventoryItemSummary } from "@/types/khipu/inventory.types";
import { RepositoryFull } from "../../interfaces/repository";
import { Result, QueryParams } from "@/types/helpers";
import { Pool, PoolClient } from "pg";

export class InventoryRepository implements RepositoryFull<InventoryItem, InventoryItemSummary, InventoryItemEditable> {

    constructor(readonly db: Pool | PoolClient) {}

    async add(data: InventoryItemEditable): Promise<Result<InventoryItem, string>> {
        throw new Error("Method not implemented.");
    }

    async update(data: InventoryItem): Promise<Result<InventoryItem, string>> {
        throw new Error("Method not implemented.");
    }

    async remove(id: string): Promise<Result<null, string>> {
        throw new Error("Method not implemented.");
    }

    async get(id: string): Promise<InventoryItem | null> {
        throw new Error("Method not implemented.");
    }

    async getAllSummary(query?: QueryParams<InventoryItem> | undefined): Promise<InventoryItemSummary[]> {
        throw new Error("Method not implemented.");
    }

    async getAll(query?: QueryParams<InventoryItem> | undefined): Promise<InventoryItem[]> {
        throw new Error("Method not implemented.");
    } 
}