import { RequireAtLeastOne } from "@/core/shared";
import { Acquisition, InventoryGroup, InventoryItem, VariantInventoryItem } from "@/core/domain";

export type EditInventoryGroupDto = RequireAtLeastOne<Partial<Omit<InventoryGroup,"items">>> & { id : string};
export type InventoryGroupInfoDto = Omit<InventoryGroup, "items"> & { count: number };
export type CreateInventoryGroupDto = Omit<InventoryGroup, "id" | "items" | "update_at"> & { period: string };
export type InventoryGroupDto = Omit<InventoryGroup, "items">;

export type InventoryItemInfoDto = Pick<InventoryItem, "id" | "total" | "catalogItem">;
export type CreateInventoryItemDto = Omit<InventoryItem, "id" | "total" | "update_at"> & { groupId: string };
export type EditInventoryItemDto = RequireAtLeastOne<Omit<InventoryItem, "total" | "variant" | "update_at" | "id">> & { id: string };
export type InventoryItemDto = {
    catalog_item_id: string | null;
    catalog_item_name: string | null;
    id: string | null;
    total: number | null;
    catalog_item: {
        id: string;
        name: string;
    }[]
}

export type EditVariantInventoryItemDto = RequireAtLeastOne<
    Omit<VariantInventoryItem, "id" | "update_at" | "acquisition">> &
    { id: string, acquisition?: Omit<EditAcquisitionDto, "id"> };

export type CreateVariantInventoryItemDto = 
    Omit<VariantInventoryItem, "id" | "update_at" | "acquisition"> &
    { acquisition: CreateAcquisitionDto };

export type VariantInventoryItemDto = {
    acquisition_id: string;
    brand: string | null;
    caracteristic: string | null;
    color: string;
    conservation_status: string;
    count: number;
    height: number;
    id: string;
    images: string[] | null;
    inventory_item_id: string;
    length: number;
    model: string | null;
    notes: string | null;
    serial_number: string | null;
    updated_at: string | null;
    width: number;
    acquisition: {
        date: string;
        id: string;
        number: string;
        price: number;
        type: string;
    };
}

export type VariantInventoryItemDtoWithItem = {
    acquisition_id: string;
    brand: string | null;
    caracteristic: string | null;
    color: string;
    conservation_status: string;
    count: number;
    height: number;
    id: string;
    images: string[] | null;
    inventory_item_id: string;
    length: number;
    model: string | null;
    notes: string | null;
    serial_number: string | null;
    updated_at: string | null;
    width: number;
    acquisition: {
        date: string;
        id: string;
        number: string;
        price: number;
        type: string;
    };
    inventory_item: {
        catalog_item_id: string;
        group_id: string;
        id: string;
        total: number;
        updated_at: string | null;
    };
}

export type EditAcquisitionDto = RequireAtLeastOne<Omit<Acquisition, "update_at">> & { id: string };
export type CreateAcquisitionDto = Omit<Acquisition, "id" | "update_at">;