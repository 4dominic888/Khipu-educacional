import { CreateVariantInventoryItemDto, EditVariantInventoryItemDto } from "@/core/domain";
import { VariantInventoryItemRepository } from "@/core/ports/repositories/inventory";
import { asFailure } from "@/core/shared";
import { PostgreInventoryVariantRepository } from "@/infrastructure/repositories/variant";
import { deleteLogs } from "@/infrastructure/shared/logger";
import { describe } from "vitest";

let repo : VariantInventoryItemRepository;

beforeAll(async () => {
    repo = new PostgreInventoryVariantRepository();
    await deleteLogs();
});

describe("Get a variant from item", () => {
    it("should get a variant from item", async () => {

        const variantToGet = (await repo.get('40000000-0000-0000-0000-000000000001'))!;
        expect(variantToGet).toBeDefined();
        expect(variantToGet.id).toBe('40000000-0000-0000-0000-000000000001');
        expect(variantToGet.color).toBe('Negro');
        expect(variantToGet.dimensions.width).toBe(0.450);
        expect(variantToGet.acquisition.number).toBe('R-001');
        expect(variantToGet.count).toBe(5);
    });

    it("should not get a variant from item", async () => {
        const variantToGet : string = '00000000-0000-0000-0000-000000000000';

        const result = await repo.get(variantToGet);
        expect(result).toBeNull();
    });
});

describe("Add variants to inventory", () => {
    it("should add a variant to inventory", async () => {
        const variantToAdd : CreateVariantInventoryItemDto = {
            acquisition: {
                date: new Date().toISOString(),
                number: '123456789',
                price: 100,
                type: "Donación"
            },
            color: 'verde',
            conservationStatus: "Regular",
            dimensions: {
                height: 10,
                length: 10,
                width: 10
            },
            inventory_item_id: '20000000-0000-0000-0000-000000000001',
            model: 'Air Max 97',
            observations: {
                notes: 'Este es un test',
                images: ['https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png']
            },
            count: 7
        };

        const result = await repo.add(variantToAdd);

        expect(result.ok).toBe(true);
        expect(result.value).toBeDefined();

        if(result.ok) await repo.remove(result.value);
    });
});

describe("Remove a variant from item", () => {
    it("should remove a variant from item", async () => {

        const variantTestData : CreateVariantInventoryItemDto = {
            acquisition: {
                date: new Date().toISOString(),
                number: '123456789',
                price: 100,
                type: "Donación"
            },
            color: 'verde',
            conservationStatus: "Regular",
            dimensions: { height: 10, length: 10, width: 10},
            inventory_item_id: '20000000-0000-0000-0000-000000000001',
            count: 7
        };

        const variantToRemove : string = (await repo.add(variantTestData)).value;

        const result = await repo.remove(variantToRemove);
        expect(result.ok).toBe(true);
        expect(result.value).toBe(variantToRemove);
    });

    it("should not remove a variant from item", async () => {
        const variantToRemove : string = '00000000-0000-0000-0000-000000000000';

        const result = await repo.remove(variantToRemove);
        expect(result.ok).toBe(false);
        console.log(asFailure(result).error);
    });
});

describe("Update a variant from inventory", () => {
    it("should update a variant from inventory", async () => {
        const variantTestData : CreateVariantInventoryItemDto = {
            acquisition: {
                date: new Date().toISOString(),
                number: '123456789',
                price: 100,
                type: "Donación"
            },
            color: 'verde',
            conservationStatus: "Regular",
            dimensions: { height: 10, length: 10, width: 10},
            inventory_item_id: '20000000-0000-0000-0000-000000000001',
            count: 7
        };

        const variantIdUpdated : string = (await repo.add(variantTestData)).value;
        console.log(variantIdUpdated);

        const variantToUpdateData : EditVariantInventoryItemDto = {
            id: variantIdUpdated,
            acquisition: {
                date: new Date().toISOString(),
                number: 'R-10456',
                price: 90,
                type: "Donación"
            },
            color: 'morado',
            count: 10
        };

        const result = await repo.update(variantToUpdateData);
        expect(result.ok).toBe(true);
        expect(result.value).toBe(true);

        const variantAfterUpdate = (await repo.get(variantIdUpdated))!;
        expect(variantAfterUpdate.color).toBe('morado');
        expect(variantAfterUpdate.acquisition.price).toBe(90);
        expect(variantAfterUpdate.acquisition.number).toBe('R-10456');


        if(result.ok) await repo.remove(variantIdUpdated);
    });

    it('should update a variant from inventory without acquisition', async () => {
        const variantTestData : CreateVariantInventoryItemDto = {
            color: 'verde',
            conservationStatus: "Regular",
            dimensions: { height: 10, length: 10, width: 10},
            inventory_item_id: '20000000-0000-0000-0000-000000000001',
            count: 7,
            acquisition: {
                date: new Date().toISOString(),
                number: '123456789',
                price: 10,
                type: "Boleta"
            }
        };

        const variantIdUpdated : string = (await repo.add(variantTestData)).value;
        console.log(variantIdUpdated);

        const variantToUpdateData : EditVariantInventoryItemDto = {
            id: variantIdUpdated,
            color: 'naranja claro',
            count: 10
        };

        const result = await repo.update(variantToUpdateData);
        expect(result.ok).toBe(true);
        expect(result.value).toBe(true);

        const variantAfterUpdate = (await repo.get(variantIdUpdated))!;
        expect(variantAfterUpdate.color).toBe('naranja claro');
        expect(variantAfterUpdate.acquisition.type).toBe('Boleta');


        if(result.ok) await repo.remove(variantIdUpdated);
    });

    it("should not update a variant from inventory", async () => {
        const variantToUpdateData : EditVariantInventoryItemDto = {
            id: '00000000-0000-0000-0000-000000000000',
            color: 'naranja',
            count: 10,
        };

        const result = await repo.update(variantToUpdateData);
        expect(result.ok).toBe(false);
    });
});

describe("duplicate a variant", () => {
    it("should duplicate a variant", async () => {
        const duplicateResult = await repo.duplicate('40000000-0000-0000-0000-000000000001');
        expect(duplicateResult.ok).toBe(true);
        expect(duplicateResult.value).toBeDefined();

        const variantAfterDuplicate = (await repo.get(duplicateResult.value))!;
        expect(variantAfterDuplicate.color).toBe('Negro');
        expect(variantAfterDuplicate.dimensions.width).toBe(0.450);
        expect(variantAfterDuplicate.acquisition.number).toBe('R-001');
        expect(variantAfterDuplicate.count).toBe(5);

        if(duplicateResult.ok) await repo.remove(duplicateResult.value);
    });
});