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

    it('should be able to load a xlsx catalog file and save it to the database', async () => {
        const inventoryService : InventoryService = new MockInventoryService();

        const result = await inventoryService.loadXlsxCatalog('test.xlsx');

        expect(result.ok).toBe(true);

        const catalogOfItems = await inventoryService.getCatalogOfItems();

        expect(catalogOfItems.ok).toBe(true);
        expect(catalogOfItems.value).toBeDefined();
        expect(catalogOfItems.value).toHaveLength(MockInventoryService.CatalogTestData.length);
    });
});