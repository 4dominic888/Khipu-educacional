import { vi } from "vitest"
import { InventoryService } from "./service"
import { CatalogItem, InventoryGroup, InventoryGroupInfo, InventoryItem, VariantInventoryItem } from "@/types/khipu/inventory.types"
import { Result, success } from "@/types/helpers"

export class MockInventoryService extends InventoryService {

    public static readonly GroupTestDataWithNoItems : InventoryGroup = { 
        id: '123',
        name: 'Test Group',
        description: 'This is a test group',
        items: []
    };

    public static readonly CatalogTestData : CatalogItem[] = [
        {
            id: '456',
            name: 'Test Item'
        },
        {
            id: '789',
            name: 'Test Item 2'
        }
    ];

    public static readonly VariantTestData : VariantInventoryItem[] = [
        {
            color: 'Azul',
            dimensions: {
                length: 1,
                width: 2,
                height: 3
            },
            serialNumber: '123456789',
            brand: 'Tesla',
            model: 'Model X',
            caracteristic: 'Motor',
            conservationStatus: 'Bueno',
            acquisition: {
                type: 'Recibo',
                number: '123456789',
                date: '2023-01-01',
                price: 1000
            },
            observations: {
                notes: 'Notas',
                images: ['image1.jpg', 'image2.jpg']
            }
        },
        {
            color: 'Rojo',
            dimensions: {
                length: 4,
                width: 5,
                height: 6
            },
            serialNumber: '987654321',
            brand: 'BMW',
            model: 'M3',
            caracteristic: 'Motor',
            conservationStatus: 'Bueno',
            acquisition: {
                type: 'Recibo',
                number: '987654321',
                date: '2023-01-02',
                price: 2000
            },
            observations: {
                notes: 'Notas',
                images: ['image1.jpg', 'image2.jpg']
            }
        }
    ];

    public static readonly InventoryItemTestData : InventoryItem = {
        catalogItem: MockInventoryService.CatalogTestData[0],
        variant: MockInventoryService.VariantTestData
    };

    public static readonly GroupTestDataWithItems : InventoryGroup = { 
        id: '123',
        name: 'Test Group',
        description: 'This is a test group',
        items: [
            {
                catalogItem: MockInventoryService.CatalogTestData[0],
                variant: MockInventoryService.VariantTestData
            }
        ]
    };

    public override createGroupWithouItems(group: InventoryGroupInfo): Promise<Result<InventoryGroup, string>> {
        return super.createGroupWithouItems(group)
    }

    validateGroup = vi.fn().mockResolvedValue(
        success<void>(undefined)
    );

    createGroup = vi.fn().mockResolvedValue(
        success<InventoryGroup>(MockInventoryService.GroupTestDataWithNoItems)
    );

    loadXlsxCatalog = vi.fn().mockResolvedValue(
        success<string>('Datos cargados correctamente')
    );

    getCatalogOfItems = vi.fn().mockResolvedValue(
        success<CatalogItem[]>(MockInventoryService.CatalogTestData)
    );

    createInventoryItem = vi.fn().mockResolvedValue(
        success<InventoryItem>(MockInventoryService.InventoryItemTestData)
    );
}