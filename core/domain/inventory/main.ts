//* Business logic types
export interface InventoryGroup {
    id: string //* UUID
    period: string //* ID del periodo a el que pertenece
    name: string
    description?: string
    items: InventoryItem[]
    update_at?: string
}

export interface CatalogItem {
    id: string
    name: string
}

export type AcquisitionType = "Recibo" | "Boleta" | "Donación";

export interface Acquisition {
    id: string,
    type: AcquisitionType,
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

export type ConservationStatus = "Bueno" | "Regular" | "Malo";

export interface VariantInventoryItem {
    id: string
    color: string,
    inventory_item_id: string,
    dimensions: { //* Medidas en metros decimales
        length: number
        width: number
        height: number
    }
    serialNumber?: string
    brand?: string
    model?: string
    caracteristic?: string
    conservationStatus: ConservationStatus,
    acquisition: Acquisition
    observations?: {
        notes: string
        images: string[]
    }
    count: number,
    update_at?: string
}