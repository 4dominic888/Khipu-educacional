import { RequireAtLeastOne } from "@/core/shared";
import { CatalogItem, InventoryGroup, InventoryItem, VariantInventoryItem } from "@/core/domain";

export type CatalogItemEditable = RequireAtLeastOne<Partial<Omit<CatalogItem, "id">>>;

export type InventoryGroupEditable = RequireAtLeastOne<Partial<Omit<InventoryGroup, "id" |"items">>>;
export type InventoryGroupInfo = Omit<InventoryGroup, "items"> & { count: number };

export type InventoryItemSummary = Pick<InventoryItem, "id" | "total" | "catalogItem">;
export type InventoryItemToAdd = Omit<InventoryItem, "id" | "total" | "update_at"> & { groupId: string };
export type InventoryItemEditable = RequireAtLeastOne<Omit<InventoryItem, "total" | "id" | "update_at">>;

export type VariantInventoryItemEditable = RequireAtLeastOne<Omit<VariantInventoryItem, "id" | "count" | "update_at">>;
export type VariantInventoryItemToAdd = Omit<VariantInventoryItem, "id" | "count" | "update_at">;