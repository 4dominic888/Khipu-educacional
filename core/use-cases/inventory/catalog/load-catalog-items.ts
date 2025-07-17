import { CatalogImporter } from "@/core/ports/io";
import { CatalogItemRepository } from "@/core/ports/repositories/inventory";
import { CatalogTemplateProvider } from "@/core/ports/templates/catalog-template-provider";
import { ReadableFile, Result } from "@/core/shared";

export class LoadCatalogItems {
    constructor(private readonly deps: {
        importer: CatalogImporter,
        repository: CatalogItemRepository,
        templateProvider: CatalogTemplateProvider
    }) {}

    async execute(file?: ReadableFile): Promise<Result<undefined | number, string>> {
        const { importer, repository, templateProvider } = this.deps;

        const theFile = file ?? await templateProvider.getDefaultCatalogTemplate();
        
        const formatResult = await importer.validateFormat(theFile);
        if (!formatResult.ok) return formatResult;
        
        if(file !== undefined) await templateProvider.updateManualCatalogTemplate(file);

        const importResult = await importer.importFromExcel(theFile);
        if (!importResult.ok) return importResult;

        const CatalogItems = importResult.value;

        const checkTroublesResult = await importer.checkImportTroubles(CatalogItems);
        if (!checkTroublesResult.ok) return checkTroublesResult;

        return await repository.addAll(CatalogItems);
    }
}