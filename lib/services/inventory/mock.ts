import { vi } from "vitest"
import { InventoryService } from "./service"
import { CatalogItem, InventoryGroup, InventoryGroupInfo } from "@/types/khipu/inventory.types"
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
}