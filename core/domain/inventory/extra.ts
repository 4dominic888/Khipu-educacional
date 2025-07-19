import { RequireAtLeastOne } from "@/core/shared";
import { InventoryGroup, InventoryItem, VariantInventoryItem } from "@/core/domain";

export type EditInventoryGroupDto = RequireAtLeastOne<Partial<Omit<InventoryGroup,"items">>> & { id : string};
export type InventoryGroupInfoDto = Omit<InventoryGroup, "items"> & { count: number };
export type CreateInventoryGroupDto = Omit<InventoryGroup, "id" | "items" | "update_at"> & { period: string };

export type InventoryItemInfoDto = Pick<InventoryItem, "id" | "total" | "catalogItem">;
export type CreateInventoryItemDto = Omit<InventoryItem, "id" | "total" | "update_at"> & { groupId: string };
export type EditInventoryItemDto = RequireAtLeastOne<Omit<InventoryItem, "total" | "id" | "update_at">>;

export type EditVariantInventoryItemDto = RequireAtLeastOne<Omit<VariantInventoryItem, "id" | "count" | "update_at">>;
export type CreateVariantInventoryItemDto = Omit<VariantInventoryItem, "id" | "count" | "update_at">;