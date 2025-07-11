import { InventoryItem, InventoryItemEditable, InventoryItemSummary } from "@/types/khipu/inventory.types";
import { RepositoryFull } from "../../interfaces/repository";
import { Result, QueryParams } from "@/types/helpers";

export class InventoryRepository implements RepositoryFull<InventoryItem, InventoryItemSummary, InventoryItemEditable> {
    add(data: InventoryItemEditable): Promise<Result<InventoryItem, string>> {
        throw new Error("Method not implemented.");
    }
    update(data: InventoryItem): Promise<Result<InventoryItem, string>> {
        throw new Error("Method not implemented.");
    }
    remove(id: string): Promise<Result<null, string>> {
        throw new Error("Method not implemented.");
    }
    get(id: string): Promise<InventoryItem | null> {
        throw new Error("Method not implemented.");
    }
    getAllSummary(query?: QueryParams<InventoryItem> | undefined): Promise<InventoryItemSummary[]> {
        throw new Error("Method not implemented.");
    }
    getAll(query?: QueryParams<InventoryItem> | undefined): Promise<InventoryItem[]> {
        throw new Error("Method not implemented.");
    } 
}