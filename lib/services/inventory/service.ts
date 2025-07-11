import { QueryParams, Result } from '@/types/helpers';
import { CatalogItem, InventoryGroup, InventoryGroupEditable, InventoryGroupInfo, InventoryItem, VariantInventoryItem } from '@/types/khipu/inventory.types';

export abstract class InventoryService {
    protected abstract validateGroup(group: InventoryGroupEditable): Promise<Result<void, string>>;
    protected abstract createGroup(group: InventoryGroupEditable): Promise<Result<InventoryGroup, string>>;

    public async createGroupWithouItems(group: InventoryGroupInfo): Promise<Result<InventoryGroup, string>> {
        const data = {...group, items: []};
        const validation = await this.validateGroup(data);
        if (!validation.ok) throw validation.error;

        const createdGroup = await this.createGroup(data);
        if (!createdGroup.ok) throw createdGroup.error;

        return createdGroup;
    }

    public abstract loadXlsxCatalog(fileName: string): Promise<Result<string, string>>;
    public abstract getCatalogOfItems(query?: QueryParams<CatalogItem>): Promise<Result<CatalogItem[], string>>;

    public abstract createInventoryItem(
        groupId: string,
        catalogItem: CatalogItem,
        variants: VariantInventoryItem[]
    ): Promise<Result<InventoryItem, string>>;
}