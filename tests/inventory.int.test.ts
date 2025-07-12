import { withTestTransaction } from "@/lib/db";
import { CatalogInventoryRepository } from "@/lib/repositories/inventory";
import { CatalogItem } from "@/types/khipu/inventory.types";

describe('inventory logic integration test', () => {
    it('should add a catalog item', async () => {
        await withTestTransaction(async (client) => {
            const catalogItemRepository = new CatalogInventoryRepository(client);
            const catalogItem : CatalogItem = {
                id: '15454',
                name: 'PUERTA DE ADOBE'
            }

            const result = await catalogItemRepository.add(catalogItem);
            expect(result.ok).toBe(true);
            expect(result.value).toStrictEqual(catalogItem);
        });
    });
});