import { CreateVariantInventoryItemDto, VariantInventoryItem, EditVariantInventoryItemDto } from "@/core/domain";
import { VariantInventoryItemRepository } from "@/core/ports/repositories/inventory";
import { Result, failure, success } from "@/core/shared";
import { supabaseClient as supaClient } from "../shared/supabase-client";
import { logger, LogMethod } from "../shared/logger";
import { parseVariantDtoWithItemToVariant } from "../shared/parsers";
import { postgreDefaultErrorMessage } from "../shared/postgre-error-messages";

export class PostgreInventoryVariantRepository implements VariantInventoryItemRepository {

    @LogMethod()
    async add(data: CreateVariantInventoryItemDto): Promise<Result<string, string>> {
        const { data: newVariantId, error } = await supaClient.rpc('add_variant_with_acquisition', {
            _variant: {
                brand: data.brand || null,
                caracteristic: data.caracteristic || null,
                color: data.color,
                conservation_status: data.conservationStatus.toString(),
                count: data.count || 0,
                width: data.dimensions.width,
                height: data.dimensions.height,
                length: data.dimensions.length,
                model: data.model || null,
                serial_number: data.serialNumber || null,
                notes: data.observations?.notes || null,
                images: data.observations?.images || null,
            },
            _acquisition: {
                type: data.acquisition.type,
                number: data.acquisition.number,
                date: data.acquisition.date,
                price: data.acquisition.price,
            },
            _inventory_item_id: data.inventory_item_id,
        });

        if (error) {
            logger.error('Error adding variant', error);
            return failure(postgreDefaultErrorMessage(error));
        }

        return success(newVariantId);
    }

    @LogMethod()
    async update(data: EditVariantInventoryItemDto): Promise<Result<boolean, string>> {
        const { error } = await supaClient.rpc('update_variant_with_acquisition', {
            _acquisition: {
                type: data.acquisition?.type?.toString() || null,
                number: data.acquisition.number || null,
                date: data.acquisition.date || null,
                price: data.acquisition.price || null,
            },
            _inventory_item_id: data.inventory_item_id,
            _variant: {
                brand: data.brand || null,
                caracteristic: data.caracteristic || null,
                color: data.color || null,
                conservation_status: data.conservationStatus || null,
                count: data.count || 0,
                width: data.dimensions?.width || null,
                height: data.dimensions?.height || null,
                length: data.dimensions?.length || null,
                model: data.model || null,
                serial_number: data.serialNumber || null,
                notes: data.observations?.notes || null,
                images: data.observations?.images || null,
            }
        });

        if (error) {
            logger.error('Error updating variant', error);
            return failure(postgreDefaultErrorMessage(error));
        }
        return success(true);
    }

    @LogMethod()
    async remove(id: string): Promise<Result<string, string>> {
        const { data: variant, error: getVariantError } = await supaClient.from('variant_inventory_item').select('id, acquisition_id').eq('id', id).single();
        if (getVariantError) {
            logger.error('Error getting variant to remove from remove method', getVariantError);
            return failure(postgreDefaultErrorMessage(getVariantError));
        }

        const { error: deleteAcquisitionError } = await supaClient.from('acquisition').delete().eq('id', variant.acquisition_id); 

        if (deleteAcquisitionError) {
            logger.error('Error removing acquisition for variant to remove from remove method', deleteAcquisitionError);
            return failure(postgreDefaultErrorMessage(deleteAcquisitionError));
        }

        return success(variant.id);
    }

    @LogMethod()
    async get(id: string): Promise<VariantInventoryItem | null> {
        const { data, error } = await supaClient.from('variant_inventory_item').select('*, acquisition(*), inventory_item(*)').eq('id', id).single();
        if (error) {
            logger.error('Error getting variant', error);
            return null;
        }
        return parseVariantDtoWithItemToVariant(data);
    }

    @LogMethod()
    async duplicate(id: string): Promise<Result<string, string>> {
        const data = await this.get(id);
        if(!data) {
            logger.error('Error getting variant to duplicate from duplicate method', id);
            return failure("No se ha podido obtener la variante para duplicarla");
        }

        const duplicateResult = await this.add(data);

        if(!duplicateResult.ok) {
            logger.error('Error duplicating variant from duplicate method', duplicateResult.error);
            return duplicateResult;
        }

        return success(duplicateResult.value);
    }

    @LogMethod()
    async getAllByInventoryItemId(inventoryItemId: string): Promise<VariantInventoryItem[]> {
        const { data, error } = await supaClient.from('variant_inventory_item').select().eq('inventory_item_id', inventoryItemId).select('*, acquisition(*), inventory_item(*)');
        if (error) {
            logger.error('Error getting variants by inventory item id', error);
            return [];
        }

        return data.map(parseVariantDtoWithItemToVariant);
    }
}