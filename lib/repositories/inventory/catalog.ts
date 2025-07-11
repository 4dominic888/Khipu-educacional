import { RepositoryFull, RepositorySimple } from "@/lib/interfaces/repository";
import { Result, QueryParams } from "@/types/helpers";
import { CatalogItem } from "@/types/khipu/inventory.types";

export class CatalogInventoryRepository implements RepositorySimple<CatalogItem> {
    add(data: CatalogItem): Promise<Result<CatalogItem, string>> {
        throw new Error("Method not implemented.");
    }
    update(data: CatalogItem): Promise<Result<CatalogItem, string>> {
        throw new Error("Method not implemented.");
    }
    remove(id: string): Promise<Result<null, string>> {
        throw new Error("Method not implemented.");
    }
    get(id: string): Promise<CatalogItem | null> {
        throw new Error("Method not implemented.");
    }
    getAll(query?: QueryParams<CatalogItem> | undefined): Promise<CatalogItem[]> {
        throw new Error("Method not implemented.");
    }
}