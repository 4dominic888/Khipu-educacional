import { Result } from '@/types/helpers';
import { InventoryGroup, InventoryGroupInfo } from '@/types/khipu/inventory.types';

export abstract class InventoryService {
    protected abstract validateGroup(group: InventoryGroup): Promise<Result<void, string>>;
    protected abstract createGroup(group: InventoryGroup): Promise<Result<InventoryGroup, string>>;

    public async createGroupWithouItems(group: InventoryGroupInfo): Promise<Result<InventoryGroup, string>> {
        const data = {...group, items: []};
        const validation = await this.validateGroup(data);
        if (!validation.ok) throw validation.error;

        const createdGroup = await this.createGroup(data);
        if (!createdGroup.ok) throw createdGroup.error;

        return createdGroup;
    }
}