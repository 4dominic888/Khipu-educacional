import { CatalogItem } from "@/core/domain";
import { InventoryItemRepository, VariantInventoryItemRepository } from "@/core/ports/repositories/inventory";
import { PostgreInventoryItemRepository } from "@/infrastructure/repositories/item";
import { PostgreInventoryVariantRepository } from "@/infrastructure/repositories/variant";
import { deleteLogs } from "@/infrastructure/shared/logger";

let repo: InventoryItemRepository;
let variantRepo: VariantInventoryItemRepository;

async function _commonVariantsToAdd(inventoryItemId: string) {
    await variantRepo.add({
        inventory_item_id: inventoryItemId,
        color: 'rojo',
        dimensions: {
            length: 10,
            width: 10,
            height: 10
        },
        serialNumber: '1234567890',
        count: 14,
        conservationStatus: 'Bueno',
        acquisition: {
            type: 'Recibo',
            number: '1234567890',
            date: '2022-01-01',
            price: 10
        },
        observations: {
            notes: 'Notas',
            images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
        }
    });

    await variantRepo.add({
        inventory_item_id: inventoryItemId,
        color: 'azul',
        dimensions: {
            length: 10,
            width: 10,
            height: 10
        },
        serialNumber: '1234567890',
        count: 2,
        conservationStatus: 'Bueno',
        acquisition: {
            type: 'Boleta',
            number: '004564',
            date: '2023-05-04',
            price: 8
        },
    });

}

beforeAll(async () => {
    repo = new PostgreInventoryItemRepository();
    variantRepo = new PostgreInventoryVariantRepository();
    await deleteLogs();
});

describe("Get a inventory item", () => {
    it("should get a inventory item", async () => {
        const inventoryItemToGet = (await repo.get('20000000-0000-0000-0000-000000000001'))!;
        expect(inventoryItemToGet).toBeDefined();
        expect(inventoryItemToGet.id).toBe('20000000-0000-0000-0000-000000000001');
        expect(inventoryItemToGet.total).toBe(10);
        expect(inventoryItemToGet.catalogItem.id).toBe('32220013');
        expect(inventoryItemToGet.catalogItem.name).toBe('SILLA');
        expect(inventoryItemToGet.variant[0]).toBeDefined();
        expect(inventoryItemToGet.variant.length).toBe(2);
        expect(inventoryItemToGet.variant[0].id).toBe('40000000-0000-0000-0000-000000000001');
    });

    it("should get a inventory item info", async () => {
        const inventoryItemToGetInfo = (await repo.getInfo('20000000-0000-0000-0000-000000000001'))!;
        expect(inventoryItemToGetInfo).toBeDefined();
        expect(inventoryItemToGetInfo.id).toBe('20000000-0000-0000-0000-000000000001');
        expect(inventoryItemToGetInfo.total).toBe(10);
        expect(inventoryItemToGetInfo.catalogItem.id).toBe('32220013');
        expect(inventoryItemToGetInfo.catalogItem.name).toBe('SILLA');
        expect(inventoryItemToGetInfo.total).toBe(10);
    });
    
    it("should not get a inventory item", async () => {
        const inventoryItemToGet : string = '00000000-0000-0000-0000-000000000000';

        const result = await Promise.all([repo.get(inventoryItemToGet), repo.getInfo(inventoryItemToGet)]);
        expect(result.every(value => value === null)).toBe(true);
    });

    it("should get many inventory items", async () => {
        const inventoryItems = await repo.getAll();
        expect(inventoryItems).toBeDefined();
        expect(inventoryItems.length).toBe(3);
        expect(inventoryItems[0].id).toBe('20000000-0000-0000-0000-000000000001');
        expect(inventoryItems[0].catalogItem).toStrictEqual<CatalogItem>({
            id: '32220013',
            name: 'SILLA'
        });
    });

    it("should get many inventory items by filter", async () => {
        const inventoryItems = await repo.getAll({
            filter: {
                total: {
                    op: 'eq',
                    value: 10
                }
            }
        });
        expect(inventoryItems).toBeDefined();
        expect(inventoryItems.length).toBe(1);
        expect(inventoryItems[0].id).toBe('20000000-0000-0000-0000-000000000001');
        expect(inventoryItems[0].total).toBe(10);
    });

    it("should get many inventory items by sort", async () => {
        const inventoryItems = await repo.getAll({
            sort: [
                {
                    direction: 'desc',
                    field: 'id'
                }
            ]
        });
        expect(inventoryItems).toBeDefined();
        expect(inventoryItems.length).toBe(3);
        expect(inventoryItems[0].id).toBe('20000000-0000-0000-0000-000000000003');
        expect(inventoryItems[0].total).toBe(2);
    });

    it("should get many inventory items by pagination", async () => {
        const inventoryItems = await repo.getAll({
            pagination: {
                page: 1,
                pageSize: 2
            }
        });
        expect(inventoryItems).toBeDefined();
        expect(inventoryItems.length).toBe(2);
        expect(inventoryItems[0].id).toBe('20000000-0000-0000-0000-000000000001');
        expect(inventoryItems[0].total).toBe(10);
    });

    it("should get many variant inventory items from Inventory Group ID", async () => {
        const itemsFromGroup = await repo.getAllByInventoryGroupId("10000000-0000-0000-0000-000000000001");
        expect(itemsFromGroup.length).toBe(2);
        expect(itemsFromGroup[0]).toBeDefined();
        expect(itemsFromGroup[0].id).toBe('20000000-0000-0000-0000-000000000001');
    });
});

describe("Create a inventory item", () => {
    it("should add an inventory item", async () => {
        const inventoryItemToRemoveResult = await repo.add({
            catalogItemId: '32220014',
            groupId: '10000000-0000-0000-0000-000000000002'
        });

        expect(inventoryItemToRemoveResult.ok).toBe(true);
        expect(inventoryItemToRemoveResult.value).toBeDefined();
        expect(inventoryItemToRemoveResult.value.catalogItem).toStrictEqual({
            id: '32220014',
            name: 'MESA'
        });

        if(inventoryItemToRemoveResult.ok) {
            await repo.remove(inventoryItemToRemoveResult.value.id);
        }
    });

    it("should add an inventory item with variants", async () => {
        const inventoryItemToRemoveResult = await repo.add({
            catalogItemId: '32220014',
            groupId: '10000000-0000-0000-0000-000000000002'
        });

        expect(inventoryItemToRemoveResult.ok).toBe(true);
        expect(inventoryItemToRemoveResult.value).toBeDefined();
        expect(inventoryItemToRemoveResult.value.catalogItem).toStrictEqual({
            id: '32220014',
            name: 'MESA'
        });

        await _commonVariantsToAdd(inventoryItemToRemoveResult.value.id);

        const inventoryWithVariants = await repo.get(inventoryItemToRemoveResult.value.id);
        expect(inventoryWithVariants).toBeDefined();
        expect(inventoryWithVariants!.total).toBe(16);
        expect(inventoryWithVariants!.variant.length).toBe(2);
        expect(inventoryWithVariants!.variant[0].color).toBe('rojo');
        expect(inventoryWithVariants!.variant[0].acquisition.price).toBe(10);

        if(inventoryItemToRemoveResult.ok) {
            await repo.remove(inventoryItemToRemoveResult.value.id);
        }
    });

    it("should not add an inventory item with a wrong catalog item id", async () => {
        const inventoryItemToAddResult = await repo.add({
            catalogItemId: '32220013',
            groupId: '10000000-0000-0000-0000-000000000001'
        });
        expect(inventoryItemToAddResult.ok).toBe(false);

        if(inventoryItemToAddResult.ok) {
            await repo.remove(inventoryItemToAddResult.value.id);
        }
    });

    it("should not add an inventory item with a wrong group id", async () => {
        const inventoryItemToAddResult = await repo.add({
            catalogItemId: '32220014',
            groupId: '10000000-0000-0000-0000-000000000008'
        });
        expect(inventoryItemToAddResult.ok).toBe(false);

        if(inventoryItemToAddResult.ok) {
            await repo.remove(inventoryItemToAddResult.value.id);
        }
    });
});

describe("Remove a inventory item", () => {
    it("should remove an inventory item", async () => {
        const inventoryItemToRemoveResult = await repo.add({
            catalogItemId: '32220014',
            groupId: '10000000-0000-0000-0000-000000000002'
        })

        const deleteResult = await repo.remove(inventoryItemToRemoveResult.value.id);

        expect(deleteResult.ok).toBe(true);
        expect(deleteResult.value).toBeDefined();
    });

    it("should remove an inventory item with its variants", async () => {
        const inventoryItemToRemoveResult = await repo.add({
            catalogItemId: '32220014',
            groupId: '10000000-0000-0000-0000-000000000002'
        });

        await _commonVariantsToAdd(inventoryItemToRemoveResult.value.id);

        const deleteResult = await repo.remove(inventoryItemToRemoveResult.value.id);
        expect(deleteResult.ok).toBe(true);
    });
});

describe("Delete variants", async () => {
    it("should remove an inventory item with variants", async () => {
        const inventoryItemToRemoveResult = await repo.add({
            catalogItemId: '32220014',
            groupId: '10000000-0000-0000-0000-000000000002'
        });

        await _commonVariantsToAdd(inventoryItemToRemoveResult.value.id);

        const variantDeleteResult = await repo.deleteVariants(inventoryItemToRemoveResult.value.id);
        expect(variantDeleteResult.ok).toBe(true);

        const inventoryItemAfterRemoveVarianstsResult = await repo.get(inventoryItemToRemoveResult.value.id);
        expect(inventoryItemAfterRemoveVarianstsResult!.total).toBe(0);
        expect(inventoryItemAfterRemoveVarianstsResult!.variant.length).toBe(0);

        if(variantDeleteResult.ok) {
            await repo.remove(inventoryItemToRemoveResult.value.id);
        }
    })
});