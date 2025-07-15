import { Filter, RequireAtLeastOne } from "../helpers"

//* Business logic types
export interface InventoryGroup {
    id: string //* UUID
    name: string
    description?: string
    items: InventoryItem[],
    update_at?: string
}

export interface CatalogItem {
    id: string
    name: string
}

export interface Acquisition {
    type: "Recibo" | "Boleta" | "Donación",
    number: string,
    date: string,
    price: number
}

export interface InventoryItem {
    id: string
    catalogItem: CatalogItem
    variant: VariantInventoryItem[],
    total: number,
    update_at?: string
}

export interface VariantInventoryItem {
    color: string
    dimensions: { //* Medidas en metros decimales
        length: number
        width: number
        height: number
    }
    serialNumber?: string
    brand?: string
    model?: string
    caracteristic?: string
    conservationStatus: "Bueno" | "Regular" | "Malo",
    acquisition: Acquisition
    observations?: {
        notes: string
        images: string[]
    }
    count: number,
    update_at?: string
}

//* Helper Logic types
export type InventoryGroupEditable = RequireAtLeastOne<Omit<InventoryGroup, "id">>
export type InventoryGroupInfo = Omit<InventoryGroup, "items"> & { count: number }
export type InventoryGroupFilter = Filter<InventoryGroup>

export type InventoryItemSummary = Pick<InventoryItem, "id" | "total" | "catalogItem">
export type InventoryItemEditable = Omit<InventoryItem, "total" | "id">