import { CreateAcquisitionDto, Acquisition, EditAcquisitionDto, AcquisitionType } from "@/core/domain";
import { AdcquisitionRepository as AcquisitionRepository } from "@/core/ports/repositories/inventory";
import { beforeAll, describe, it } from 'vitest'
import { deleteLogs } from "@/infrastructure/shared/logger";
import { PostgreInventoryAcquisitionRepository } from "@/infrastructure/repositories/adcquisiton";
import { a } from "vitest/dist/chunks/suite.d.FvehnV49.js";

let repo : AcquisitionRepository;

beforeAll(async () => {
    repo = new PostgreInventoryAcquisitionRepository();
    await deleteLogs();
});

describe('PostgreInventoryAcquisitionRepository', () => {
    it('should add an acquisition', async () => {
        const acquisitionData: CreateAcquisitionDto = {
            type: "Recibo",
            number: '12345',
            date: '2023-10-01',
            price: 1000
        };
        const result = await repo.add(acquisitionData);
        expect(result.ok).toBe(true);
        expect(result.value).toHaveProperty('id');
        expect(result.value.type).toBe(acquisitionData.type);

        if (result.ok) {
            await repo.remove(result.value.id);
        }   
    });

    it('should update an acquisition', async () => {
        const acquisitionToUpdate: EditAcquisitionDto = {
            id: '30000000-0000-0000-0000-000000000002',
            type: "Boleta",
            number: '54322',
            date: '2023-10-02',
            price: 1500
        };
        const result = await repo.update(acquisitionToUpdate);
        expect(result.ok).toBe(true);
        expect(result.value.id).toBe(acquisitionToUpdate.id);

        if (result.ok) {
            await repo.update({
                id: acquisitionToUpdate.id,
                type: "Boleta",
                number: 'B-002',
                date: '2024-02-15',
                price: 3000
            });
        }
    });

    it('should remove an acquisition', async () => {
        const result = await repo.remove('30000000-0000-0000-0000-000000000001');
        expect(result.ok).toBe(true);
        expect(result.value).toBe('30000000-0000-0000-0000-000000000001');

        if (result.ok) {
            await repo.add({
                // id: '30000000-0000-0000-0000-000000000001',
                //! PROVIDE ID IF NECESSARY
                type: "Recibo",
                number: 'R-001',
                date: '2024-01-10',
                price: 1500
            });
        }
    });

    it('should get an acquisition by id', async () => {
        const expectedAcquisition: Acquisition = {
            id: '30000000-0000-0000-0000-000000000002',
            type: "Boleta",
            number: 'B-002',
            date: '2024-02-15',
            price: 3000
        };
        const result = await repo.get(expectedAcquisition.id);

        expect(result).toBeDefined();
        expect(result).toStrictEqual(expectedAcquisition);
    });
});

