import { CatalogItem } from '@/core/domain';
import { CatalogItemRepository } from '@/core/ports/repositories/inventory';
import { asFailure } from '@/core/shared';
import { PostgreCatalogItemRepository } from '@/infrastructure/repositories/catalog';
import { deleteLogs } from '@/infrastructure/shared/logger';
import { beforeAll, describe, it } from 'vitest'

let repo : CatalogItemRepository;

beforeAll(async () => {
    repo = new PostgreCatalogItemRepository();
    await deleteLogs();
});

describe('get catalog items', () => {
    it('should get a catalog item', async () => {
        const expectedCatalogItem : CatalogItem = {
            id: '32220013',
            name: 'SILLA'
        };
        const result = await repo.get(expectedCatalogItem.id);

        expect(result).toBeDefined();
        expect(result).toStrictEqual(expectedCatalogItem);

    });

    it('should get all catalog items', async () => {
        const result = await repo.getAll();

        expect(result.length).toBe(3);
        expect(result[0].id).toBeDefined();
        expect(result[0].name).toBeDefined();
    });

    it('should get all catalog items with pagination', async () => {
        const result = await repo.getAll({
            pagination: { page: 1, pageSize: 2 },
        });

        expect(result.length).toBe(2);
    });

    it('should get all catalog items with sorting', async () => {
        const result1 = await repo.getAll({
            sort: [{ field: 'id', direction: 'desc' }],
        });

        expect(result1.length).toBe(3);
        expect(result1[0].id).toBe("32220015");

        const result2 = await repo.getAll({
            sort: [{ field: 'name', direction: 'asc' }],
        });

        expect(result2.length).toBe(3);
        expect(result2[0].name).toBe("MESA");
    });

    it('should get all catalog items with filters', async () => {
        const result = await repo.getAll({
            filter: {
                name: { op: 'contains', value: 'A' }
            }
        });

        expect(result.length).toBe(2);
        expect(result.find(item => item.name === 'MESA')).toBeDefined();
        expect(result.find(item => item.name === 'SILLA')).toBeDefined();
    });
});

describe('update catalog items', () => {
    it('should update a catalog item', async () => {
        const catalogItemToUpdate : CatalogItem = {
            id: '32220013',
            name: 'MUEBLES'
        }

        const result = await repo.update(catalogItemToUpdate);
        expect(result.ok).toBe(true);
        expect(result.value).toStrictEqual(catalogItemToUpdate);

        await repo.update({
            id: '32220013',
            name: 'SILLA'
        });


    });

    it('should not update a non existing catalog item', async () => {
        const catalogItemToUpdate : CatalogItem = {
            id: '00000000',
            name: 'MUEBLES'
        }

        const result = await repo.update(catalogItemToUpdate);
        expect(result.ok).toBe(false);
        console.log(asFailure(result).error);
    });
});

describe('remove catalog items', () => {
    it('should remove a catalog item', async () => {
        const catalogItemToRemove = (await repo.add({ id: "32220080",  name: 'IDK' })).value
        const result = await repo.remove(catalogItemToRemove.id);
        expect(result.ok).toBe(true);
        expect(result.value).toBe(catalogItemToRemove.id);

        const badResult = await repo.get(catalogItemToRemove.id);
        expect(badResult).toBeNull();
    });

    it('should not remove a non existing catalog item', async () => {
        const catalogItemToRemove : string = '00000000';
        const result = await repo.remove(catalogItemToRemove);
        expect(result.ok).toBe(false);
        console.log(asFailure(result).error);
    });

    it('should remove many catalog items', async () => {
        const catalogItemsToRemove : string[] = ['32220099', '32220100'];
        await repo.addAll([
            {
                id: catalogItemsToRemove[0],
                name: 'MUEBLERIA'
            },
            {
                id: catalogItemsToRemove[1],
                name: 'COSOS'
            }
        ]);

        const result = await repo.removeAll(catalogItemsToRemove);
        expect(result.ok).toBe(true);
        expect(result.value).toBe(2);

        const badResults = await Promise.all(catalogItemsToRemove.map(val => repo.get(val)));
        expect(badResults.every(el => el === null)).toBe(true);
    });

    it('should remove all catalog items', async () => {
        //* dry_run hace que se simule la acción a realizar esta función siempre y cuando es `true`
        //* es `false` por defecto
        const result = await repo.removeEverything({dry_run: true});
        expect(result.ok).toBe(true);
    });
});

describe('create catalog items', () => {
    it('should add a catalog item', async () => {

        const catalogItemToAdd : CatalogItem = {
            id: '15456844',
            name: 'MESA OVALADAA'
        };

        const result = await repo.add(catalogItemToAdd);

        expect(result.ok).toBe(true);
        expect(result.value).toStrictEqual(catalogItemToAdd);

        if(result.ok) await repo.remove(catalogItemToAdd.id);
    });

    it('should not add a catalog item with the same id or name', async () => {
        const catalogItemWithExistingId : CatalogItem = {
            id: '32220013',
            name: 'MESA VERDE'
        };

        const catalogItemWithExistingName : CatalogItem = {
            id: '12345678',
            name: 'SILLA'
        };

        const badResult = await repo.add(catalogItemWithExistingId);
        expect(badResult.ok).toBe(false);
        console.log(asFailure(badResult).error);

        const badResult2 = await repo.add(catalogItemWithExistingName);
        expect(badResult2.ok).toBe(false);
        console.log(asFailure(badResult2).error);

        if(badResult.ok) await repo.remove(catalogItemWithExistingId.id);
        if(badResult2.ok) await repo.remove(catalogItemWithExistingName.id);
    });

    it('should add many catalog items', async () => {
        const catalogItemsToAdd : CatalogItem[] = [
            {
                id: '96874521',
                name: 'KIT DE COCINA'
            },
            {
                id: '98863541',
                name: 'VENTANA'
            },
            {
                id: '97154665',
                name: 'COMEDERO'
            },
            {
                id: '12345677',
                name: 'HORNO'
            },
        ];

        const result = await repo.addAll(catalogItemsToAdd);

        expect(result.ok).toBe(true);
        expect(result.value).toBe(4);

        if(result.ok) {
            await repo.removeAll(catalogItemsToAdd.map(item => item.id));
        }
    });
});

describe('count catalog items', () => {
    it('should count all catalog items', async () => {
        const result = await repo.count();
        expect(result.ok).toBe(true);
        expect(result.value).toBe(3);
    });
});