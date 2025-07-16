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
    id: string
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