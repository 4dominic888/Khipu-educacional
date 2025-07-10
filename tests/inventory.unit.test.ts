import { InventoryService, MockInventoryService } from '@/lib/services/inventory';
import { describe, it, expect } from 'vitest';

describe('inventory logic type', () => {
    it('should be able to create a group and return the state of the request', async () => {

        const inventoryService : InventoryService = new MockInventoryService();
        const group = MockInventoryService.GroupTestDataWithNoItems;

        const result = await inventoryService.createGroupWithouItems(group);

        expect(result.ok).toBe(true);
        expect(result.value).toBeDefined();
        expect(result.value).toStrictEqual(group);
    });
});