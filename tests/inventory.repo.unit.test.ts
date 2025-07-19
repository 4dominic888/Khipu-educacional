import { describe, expect, it } from 'vitest'
import { PostgresCatalogItemRepository } from "@/infrastructure/repositories/catalog";
import { CatalogItem } from '@/core/domain';
import { deleteLogs } from '../infrastructure/shared/logger';

describe('catalog logic unit test', () => {

    //* Clean logs before each test, take carefully
    beforeAll(async () => await deleteLogs());

    it('should add a catalog item', async () => {
        const catalogItemRepository = new PostgresCatalogItemRepository();

        const catalogItemToAdd : CatalogItem = {
            id: '15456844',
            name: 'MESA OVALADAA'
        };
        const result = await catalogItemRepository.add(catalogItemToAdd);

        expect(result.ok).toBe(true);
        expect(result.value).toStrictEqual(catalogItemToAdd);

        await catalogItemRepository.remove(catalogItemToAdd.id);
    });

    it('should get a catalog item', async () => {
        const catalogItemRepository= new PostgresCatalogItemRepository();
        const expectedCatalogItem : CatalogItem = {
            id: '32220013',
            name: 'SILLA'
        };
        const result = await catalogItemRepository.get(expectedCatalogItem.id);

        expect(result).toBeDefined();
        expect(result!.id).toBe(expectedCatalogItem.id);
        expect(result!.name).toBe(expectedCatalogItem.name);

        const badResult = await catalogItemRepository.get('465456465465465');

        expect(badResult).toBeNull();
    });

    it('should update a catalog item', async () => {
        const catalogItemRepository = new PostgresCatalogItemRepository();
        const expectedCatalogItem : CatalogItem = {
            id: '32220013',
            name: 'MUEBLES'
        }

        const result = await catalogItemRepository.update(expectedCatalogItem);
        expect(result.ok).toBe(true);
        expect(result.value).toStrictEqual(expectedCatalogItem);

        await catalogItemRepository.update({
            id: '32220013',
            name: 'SILLA'
        });
    });
});