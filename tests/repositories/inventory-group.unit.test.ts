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