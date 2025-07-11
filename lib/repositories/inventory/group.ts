import { RepositoryFull } from "@/lib/interfaces/repository";
import { Result, QueryParams } from "@/types/helpers";
import { InventoryGroup, InventoryGroupEditable, InventoryGroupInfo } from "@/types/khipu/inventory.types";

export class GroupInventoryRepository implements RepositoryFull<InventoryGroup, InventoryGroupInfo, InventoryGroupEditable> {
    add(data: InventoryGroupEditable): Promise<Result<InventoryGroup, string>> {
        throw new Error("Method not implemented.");
    }
    update(data: InventoryGroup): Promise<Result<InventoryGroup, string>> {
        throw new Error("Method not implemented.");
    }
    remove(id: string): Promise<Result<null, string>> {
        throw new Error("Method not implemented.");
    }
    get(id: string): Promise<InventoryGroup | null> {
        throw new Error("Method not implemented.");
    }
    getAllSummary(query?: QueryParams<InventoryGroup> | undefined): Promise<InventoryGroupInfo[]> {
        throw new Error("Method not implemented.");
    }
    getAll(query?: QueryParams<InventoryGroup> | undefined): Promise<InventoryGroup[]> {
        throw new Error("Method not implemented.");
    }
}