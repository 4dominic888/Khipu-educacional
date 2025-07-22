import { AcquisitionType, ConservationStatus, VariantInventoryItem, VariantInventoryItemDto, VariantInventoryItemDtoWithItem } from "@/core/domain";

export function parseVariantDtoWithItemToVariant(dto: VariantInventoryItemDtoWithItem) : VariantInventoryItem {
    return {
        ...dto,
        acquisition: {
            ...dto.acquisition,
            type: dto.acquisition.type as AcquisitionType,
        },
        brand: dto.brand || undefined,
        model: dto.model || undefined,
        caracteristic: dto.caracteristic || undefined,
        conservationStatus: dto.conservation_status as ConservationStatus,
        observations: dto.notes && dto.images ? { 
            notes: dto.notes,
            images: dto.images,
        } : undefined,
        dimensions: {
            length: dto.length,
            width: dto.width,
            height: dto.height,
        }
    };
}

export function parseVariantDtoToVariant(dto: VariantInventoryItemDto) : VariantInventoryItem {
    return {
        ...dto,
        acquisition: {
            ...dto.acquisition,
            type: dto.acquisition.type as AcquisitionType,
        },
        brand: dto.brand || undefined,
        model: dto.model || undefined,
        caracteristic: dto.caracteristic || undefined,
        conservationStatus: dto.conservation_status as ConservationStatus,
        observations: dto.notes && dto.images ? { 
            notes: dto.notes,
            images: dto.images,
        } : undefined,
        dimensions: {
            length: dto.length,
            width: dto.width,
            height: dto.height,
        }
    };
}