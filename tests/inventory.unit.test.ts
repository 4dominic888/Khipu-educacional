import { InventoryService, MockInventoryService } from '@/lib/services/inventory';
import { VariantInventoryItem } from '@/types/khipu/inventory.types';
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

    it('should create an inventory item with variant and belong to a group', async () => {
        const inventoryService : InventoryService = new MockInventoryService();

        const group = MockInventoryService.GroupTestDataWithItems;
        const catalogResult = await inventoryService.getCatalogOfItems();

        const catalogItem = catalogResult.value[0];
        const variants : VariantInventoryItem[] = MockInventoryService.VariantTestData;

        const inventoryItem = await inventoryService.createInventoryItem(group.id, catalogItem, variants);

        expect(inventoryItem.ok).toBe(true);
        expect(inventoryItem.value).toBeDefined();
        expect(inventoryItem.value).toStrictEqual(MockInventoryService.InventoryItemTestData);
        expect(inventoryItem.value.variant).toHaveLength(2);
        expect(inventoryItem.value.total).toBe(6);
        expect(group.items).toHaveLength(1);
    });
});