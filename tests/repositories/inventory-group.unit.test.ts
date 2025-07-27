import { CreateInventoryGroupDto, EditInventoryGroupDto, InventoryGroupInfoDto } from "@/core/domain";
import { InventoryGroupRepository } from "@/core/ports/repositories/inventory";
import { asFailure } from "@/core/shared";
import { PostgreInventoryGroupRepository } from "@/infrastructure/repositories/group";
import { deleteLogs } from "@/infrastructure/shared/logger";
import { describe } from "vitest";

let repo : InventoryGroupRepository;

beforeAll(async () => {
    repo = new PostgreInventoryGroupRepository();
    await deleteLogs();
});

describe('get inventory groups', () => {
    it('should get an inventory group info', async () => {
        const expectedInventoryGroupInfo : InventoryGroupInfoDto = {
            id: '10000000-0000-0000-0000-000000000001',
            name: 'Aula 1',
            description: 'Aula del segundo piso',
            period: '00000000-0000-0000-0000-000000000000',
            count: 15,
        };
        const result = await repo.getInfo(expectedInventoryGroupInfo.id);

        expect(result).toBeDefined();
        expect(result).toStrictEqual(expectedInventoryGroupInfo);
    });

    it('should get all inventory groups', async () => {
        const result = await repo.getAllSummary();

        expect(result.length).toBe(2);
        expect(result[0].id).toBeDefined();
        expect(result[0].name).toBeDefined();
    });

    it('should get all inventory groups with pagination', async () => {
        const result = await repo.getAllSummary({
            pagination: { page: 1, pageSize: 1 },
        });

        expect(result.length).toBe(1);
    });

    it('should get all inventory groups with sorting', async () => {
        const result1 = await repo.getAllSummary({
            sort: [{ field: 'id', direction: 'desc' }],
        });

        expect(result1.length).toBe(2);
        expect(result1[0].id).toBe("10000000-0000-0000-0000-000000000002");

        const result2 = await repo.getAllSummary({
            sort: [{ field: 'name', direction: 'asc' }],
        });

        expect(result2.length).toBe(2);
        expect(result2[0].name).toBe("Aula 1");
    });

    it('should get all inventory groups with filters', async () => {
        const result = await repo.getAllSummary({
            filter: {
                name: { op: 'contains', value: 'Aula' }
            }
        });

        expect(result.length).toBe(1);
        expect(result.find(item => item.name === 'Aula 1')).toBeDefined();
    });
});

describe('update inventory groups', () => {
    it('should update an inventory group', async () => {
        const inventoryGroupToUpdate : EditInventoryGroupDto = {
            id: '10000000-0000-0000-0000-000000000001',
            name: 'Aula 500'
        };

        const result = await repo.updateInformation(inventoryGroupToUpdate);
        expect(result.ok).toBe(true);
        expect(result.value!.name).toStrictEqual('Aula 500');

        await repo.updateInformation({
            id: '10000000-0000-0000-0000-000000000001',
            name: 'Aula 1'
        });
    });

    it('should not update a non existing inventory group', async () => {
        const inventoryGroupToUpdate : EditInventoryGroupDto = {
            id: '00000000-0000-0000-0000-000000000000',
            description: 'Aula del primer piso'
        };

        const result = await repo.updateInformation(inventoryGroupToUpdate);
        expect(result.ok).toBe(false);
        console.log(asFailure(result).error);
    });

    it('should not update a non existing period id', async () => {
        const inventoryGroupToUpdate : EditInventoryGroupDto = {
            id: '10000000-0000-0000-0000-000000000001',
            period: '12345000-0000-0000-0000-000000000000',
            name: 'Aula 600'
        };

        const result = await repo.updateInformation(inventoryGroupToUpdate);
        expect(result.ok).toBe(false);
        console.log(asFailure(result).error);
    });
});

describe('add inventory groups', () => {
    it('should add an inventory group', async () => {
        const inventoryGroupToAdd : CreateInventoryGroupDto = {
            name: 'Aula 600',
            description: 'Aula del sexto piso',
            period: '00000000-0000-0000-0000-000000000000'
        };

        const result = await repo.add(inventoryGroupToAdd);
        expect(result.ok).toBe(true);
        expect(result.value.name).toStrictEqual('Aula 600');
        expect(result.value.description).toStrictEqual('Aula del sexto piso');
        expect(result.value.period).toStrictEqual('00000000-0000-0000-0000-000000000000');

        if(result.ok) await repo.remove(result.value.id);
    });

    it('should not add an inventory group with a non existing period id', async () => {
        const inventoryGroupToAdd : CreateInventoryGroupDto = {
            name: 'Aula 600',
            description: 'Aula del sexto piso',
            period: '12345000-0000-0000-0000-000000000000'
        };

        const result = await repo.add(inventoryGroupToAdd);
        expect(result.ok).toBe(false);
        console.log(asFailure(result).error);
    });

    it('should insert an inventory group', async () => {
        const inventoryGroupToAdd : CreateInventoryGroupDto = {
            name: 'Aula 600',
            description: 'Aula del sexto piso',
            period: '00000000-0000-0000-0000-000000000000'
        };

        const result = await repo.insert('10000000-0000-0000-0000-000000000003', inventoryGroupToAdd);
        expect(result.ok).toBe(true);
        expect(result.value.name).toStrictEqual('Aula 600');
        expect(result.value.description).toStrictEqual('Aula del sexto piso');
        expect(result.value.period).toStrictEqual('00000000-0000-0000-0000-000000000000');

        if(result.ok) await repo.remove(result.value.id);
    });
});

describe('delete inventory groups', () => {
    it('should delete an inventory group', async () => {
        const testAddedResult = await repo.add({
            name: 'Aula 600',
            description: 'Aula del sexto piso',
            period: '00000000-0000-0000-0000-000000000000'
        });

        const result = await repo.remove(testAddedResult.value.id);
        expect(result.ok).toBe(true);
        expect(result.value).toBe(testAddedResult.value.id);

        const deletedGroupInfo = await repo.getInfo(testAddedResult.value.id);
        expect(deletedGroupInfo).toBe(null);
    });

    it('should not delete a non existing inventory group', async () => {
        const result = await repo.remove('00000000-0000-0000-0000-000000000000');
        expect(result.ok).toBe(false);
        console.log(asFailure(result).error);
    });

    it('should delete many inventory groups', async () => {
        const testAddedResult1 = await repo.add({
            name: 'Aula 600',
            description: 'Aula del sexto piso',
            period: '00000000-0000-0000-0000-000000000000'
        });
        const testAddedResult2 = await repo.add({
            name: 'Aula 601',
            description: 'Aula del sexto piso',
            period: '00000000-0000-0000-0000-000000000000'
        });

        const result = await repo.removeAll([testAddedResult1.value.id, testAddedResult2.value.id]);
        expect(result.ok).toBe(true);
        expect(result.value).toBe(2);

        const deletedGroupInfo1 = await repo.getInfo(testAddedResult1.value.id);
        expect(deletedGroupInfo1).toBe(null);

        const deletedGroupInfo2 = await repo.getInfo(testAddedResult2.value.id);
        expect(deletedGroupInfo2).toBe(null);
    });

    it('should delete all inventory groups', async () => {
        const result = await repo.removeEverything();
        expect(result.ok).toBe(true);
        expect(result.value).toBe(2);

        if(result.ok) {
            Promise.all([
                repo.insert('10000000-0000-0000-0000-000000000001', {
                    name: 'Aula 1',
                    description: 'Aula del segundo piso',
                    period: '00000000-0000-0000-0000-000000000000'
                }),
                repo.insert('10000000-0000-0000-0000-000000000002', {
                    name: 'Cocina',
                    description: 'Área de preparación de alimentos',
                    period: '00000000-0000-0000-0000-000000000000'
                })
            ]);
        }
    });
});

describe('count inventory groups', () => {
    it('should count inventory groups', async () => {
        const result = await repo.count();
        expect(result.ok).toBe(true);
        expect(result.value).toBe(2);
    });
});

describe('duplicate inventory groups', () => {
    it('should duplicate an inventory group', async () => {
        const result = await repo.duplicate('10000000-0000-0000-0000-000000000001');
        expect(result.ok).toBe(true);
        expect(result.value).toBeDefined();

        const duplicatedGroupInfo = await repo.getInfo(result.value);
        console.log(duplicatedGroupInfo);
        expect(duplicatedGroupInfo?.name).toBe('Aula 1 (1)');

        if(result.ok) await repo.remove(result.value);
    });

    it('should not duplicate a non existing inventory group', async () => {
        const result = await repo.duplicate('00000000-0000-0000-0000-000000000000');
        expect(result.ok).toBe(false);
        console.log(asFailure(result).error);
    });
});