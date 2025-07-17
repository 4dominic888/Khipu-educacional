import { CatalogItemRepository } from "@/core/ports/repositories/inventory";
import { Result, success } from "@/core/shared";

export class CheckCatalogIsEmpty {
    constructor(private readonly deps: {
        repository: CatalogItemRepository
    }) {}

    async execute(): Promise<Result<boolean, string>> {
        const { repository } = this.deps;
        const countResult = await repository.count();
        if (!countResult.ok) return countResult;
        return success(countResult.value === 0);
    }
}