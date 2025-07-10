import { vi } from "vitest"
import { InventoryService } from "./service"
import { InventoryGroup, InventoryGroupInfo } from "@/types/khipu/inventory.types"
import { Result, success } from "@/types/helpers"

export class MockInventoryService extends InventoryService {

    public static readonly GroupTestDataWithNoItems : InventoryGroup = { 
        id: '123',
        name: 'Test Group',
        description: 'This is a test group',
        items: []
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
}