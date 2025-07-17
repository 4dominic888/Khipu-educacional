import { withTestTransaction } from "@/infrastructure/shared/db";
import { CatalogInventoryRepository, GroupInventoryRepository, InventoryRepository } from "@/lib/repositories/inventory";
import { CatalogItem, InventoryGroup, InventoryGroupEditable, InventoryGroupInfo } from "@/core/domain/inventory/main";

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

    it('should add an amount of catalog items', async () => {
        await withTestTransaction(async (client) => {
            const catalogItemRepository = new CatalogInventoryRepository(client);
            const catalogItems : CatalogItem[] = [
                {
                    id: '15454',
                    name: 'PUERTA DE ADOBE'
                },
                {
                    id: '15455',
                    name: 'PUERTA DE ADOBE 2'
                },
                {
                    id: '15456',
                    name: 'PUERTA DE ADOBE 3'
                }
            ]

            const result = await catalogItemRepository.addAll(catalogItems);
            expect(result.ok).toBe(true);
            expect(result.value).toBeUndefined();
        });
    });

    it('should get a catalog item', async () => {
        await withTestTransaction(async (client) => {
            const catalogItemRepository = new CatalogInventoryRepository(client);
            const expectedCatalogItem : CatalogItem = {
                id: '00000000-0000-0000-0000-000000000001',
                name: 'Silla'
            }

            const result = await catalogItemRepository.get(expectedCatalogItem.id);
            expect(result).toStrictEqual(expectedCatalogItem);
        });
    });

    it('should get all catalog items', async () => {
        await withTestTransaction(async (client) => {
            const catalogItemRepository = new CatalogInventoryRepository(client);
            const expectedCatalogItems : CatalogItem[] = [
                {
                    id: '00000000-0000-0000-0000-000000000001',
                    name: 'Silla'
                },
                {
                    id: '00000000-0000-0000-0000-000000000002',
                    name: 'Mesa'
                },
                {
                    id: '00000000-0000-0000-0000-000000000003',
                    name: 'Proyector'
                }
            ]

            const result = await catalogItemRepository.getAll({
                sort: [{ field: 'id', direction: 'asc' }],
            });
            expect(result).toStrictEqual(expectedCatalogItems);


            const result2 = await catalogItemRepository.getAll({});
            expect(result2).toBeDefined();
            expect(result2.length).toBe(3);

            const result3 = await catalogItemRepository.getAll({
                filter: { name: { op: 'contains', value: 'e' } },
            });
            expect(result3.length).toBe(2);
        });
    });

    it('should update a catalog item', async () => {
        await withTestTransaction(async (client) => {
            const catalogItemRepository = new CatalogInventoryRepository(client);
            const expectedCatalogItem : CatalogItem = {
                id: '00000000-0000-0000-0000-000000000001',
                name: 'Muebles'
            }

            const result = await catalogItemRepository.update(expectedCatalogItem);
            expect(result.ok).toBe(true);
            expect(result.value).toStrictEqual(expectedCatalogItem);
            expect(result.value.name).toBe('Muebles');
        });
    });

    it('should remove a catalog item', async () => {
        await withTestTransaction(async (client) => {
            const catalogItemRepository = new CatalogInventoryRepository(client);
            const result = await catalogItemRepository.remove('00000000-0000-0000-0000-000000000001');
            expect(result.ok).toBe(true);
            
            const getResult = await catalogItemRepository.get('00000000-0000-0000-0000-000000000001');
            expect(getResult).toBeUndefined();

            const getAllResult = await catalogItemRepository.getAll();
            expect(getAllResult.length).toBe(2);
        });
    });
});

describe('inventory group logic integration test', () => {
    it('should add a inventory group', async () => {
        await withTestTransaction(async (client) => {
            const inventoryGroupRepository = new GroupInventoryRepository(client);
            const inventoryGroup : InventoryGroupEditable = {
                name: 'Almacen',
                description: 'Habitación del segundo piso'
            }

            const result = await inventoryGroupRepository.add(inventoryGroup);
            expect(result.ok).toBe(true);
            expect(result.value.id).toBeDefined();
            expect(result.value.name).toBe('AULA 1');
            expect(result.value.description).toBe('Aula del segundo piso');
        });
    });

    it('should update a inventory group', async () => {
        await withTestTransaction(async (client) => {
            const inventoryGroupRepository = new GroupInventoryRepository(client);
            const expectedInventoryGroup : InventoryGroup = {
                id: '10000000-0000-0000-0000-000000000001',
                name: 'AULA 2',
                description: 'Aula del segundo piso',
                items: [],
            }

            const result = await inventoryGroupRepository.update(expectedInventoryGroup);
            expect(result.ok).toBe(true);
            expect(result.value.name).toBe('AULA 2');
            expect(result.value.description).toBe('Aula del segundo piso');
        });
    });

    it('should remove a inventory group', async () => {
        await withTestTransaction(async (client) => {
            const inventoryGroupRepository = new GroupInventoryRepository(client);
            const result = await inventoryGroupRepository.remove('10000000-0000-0000-0000-000000000001');
            expect(result.ok).toBe(true);
            
            const getResult = await inventoryGroupRepository.get('10000000-0000-0000-0000-000000000001');
            expect(getResult).toBeUndefined();

            const getAllResult = await inventoryGroupRepository.getAll();
            expect(getAllResult.length).toBe(1);
        });
    });

    it('should get a inventory group summary', async () => {
        await withTestTransaction(async (client) => {
            const inventoryGroupRepository = new GroupInventoryRepository(client);

            const expectedSummary : InventoryGroupInfo[] = [
                {
                    id: '10000000-0000-0000-0000-000000000001',
                    name: 'Aula 1',
                    description: 'Aula del segundo piso',
                    count: 15
                },
                {
                    id: '10000000-0000-0000-0000-000000000002',
                    name: 'Cocina',
                    description: 'Área de preparación de alimentos',
                    count: 2
                }
            ]

            const result = await inventoryGroupRepository.getAllSummary();
            expect(result).toStrictEqual(expectedSummary);
        });
    });
});
