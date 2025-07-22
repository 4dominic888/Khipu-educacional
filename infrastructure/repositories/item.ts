import { CreateInventoryItemDto, InventoryItem, EditInventoryItemDto, InventoryItemInfoDto, InventoryItemDto } from "@/core/domain";
import { InventoryItemRepository } from "@/core/ports/repositories/inventory";
import { Result, QueryParams, failure, success } from "@/core/shared";
import { supabaseClient as supaClient } from "../shared/supabase-client";
import { logger, LogMethod } from "../shared/logger";
import { parseVariantDtoToVariant } from "../shared/parsers";
import { buildQueryFromParams } from "../shared/supabase-extra";

export class PostgreInventoryItemRepository implements InventoryItemRepository {
    @LogMethod()
    async moveToGroup(itemId: string, groupId: string): Promise<Result<boolean, string>> {
        const { error } = await supaClient.from('inventory_item').update({ group_id: groupId }).eq('id', itemId);
        if (error) {
            logger.error('Error moving inventory item to group', error);
            return failure("No se ha podido mover el item de inventario");
        }
        return success(true);
    }
    
    @LogMethod()
    async deleteVariants(itemId: string): Promise<Result<boolean, string>> {
        const { error } = await supaClient.rpc('delete_variants', {item_id: itemId});
        if (error) {
            logger.error('Error deleting inventory item variants', error);
            return failure("No se ha podido eliminar las variantes del item de inventario");
        }

        return success(true);
    }

    @LogMethod()
    async add(data: CreateInventoryItemDto): Promise<Result<InventoryItem, string>> {
        const { data: item, error } = await supaClient.from('inventory_item').insert({
            group_id: data.groupId,
            catalog_item_id: data.catalogItem.id,
            total: 0
        }).select('*, catalog_item(*)').single();

        if (error) {
            logger.error('Error adding inventory item', error);
            return failure("No se ha podido añadir el item de inventario");
        }

        return success({
            ...item,
            catalogItem: item.catalog_item,
            variant: [],
        });
    }

    @LogMethod()
    async update(data: EditInventoryItemDto): Promise<Result<InventoryItem, string>> {
        const { data: item, error } = await supaClient.from('inventory_item').update(data).eq('id', data.id!).select('*, catalog_item(*)').single();
        if (error) {
            logger.error('Error updating inventory item', error);
            return failure("No se ha podido actualizar el item de inventario");
        }

        return success({
            id: item.id,
            catalogItem: item.catalog_item,
            total: item.total,
            variant: [],
        });
    }

    @LogMethod()
    async remove(id: string): Promise<Result<string, string>> {
        const { error } = await supaClient.from('inventory_item').delete().eq('id', id);
        if (error) {
            logger.error('Error removing inventory item', error);
            return failure("No se ha podido eliminar el item de inventario");
        }
        return success(id);
    }

    @LogMethod()
    async getInfo(id: string): Promise<InventoryItemInfoDto | null> {
        const { data, error } = await supaClient.from('inventory_item_summary').select('*').eq('id', id).single();
        if (error) {
            logger.error('Error getting inventory item info', error);
            return null;
        }

        if(!data || !data.id || !data.catalog_item_id) { 
            logger.error('Error getting inventory item info', data);
            return null;
        }

        return {
            id: data.id!,
            catalogItem: {
                id: data.catalog_item_id!,
                name: data.catalog_item_name!,
            },
            total: data.total!,
        };
    }

    @LogMethod()
    async get(id: string): Promise<InventoryItem | null> {
        const { data, error } = await supaClient.from('inventory_item').select('*, catalog_item(*), variant_inventory_item(*, acquisition(*))').eq('id', id).single();
        if (error) {
            logger.error('Error getting inventory item', error);
            return null;
        }

        return {
            ...data,
            catalogItem: data.catalog_item,
            variant: data.variant_inventory_item.map(parseVariantDtoToVariant),
        };
    }

    @LogMethod()
    async getAll(query?: QueryParams<InventoryItem> | undefined): Promise<InventoryItemInfoDto[]> {
        const completeQuery = buildQueryFromParams(supaClient.from('inventory_item_summary').select('*, catalog_item(*)'), query);
        const { data, error } = await completeQuery;
        if (error) {
            logger.error('Error getting inventory items', error);
            return [];
        }

        return data.map((item: InventoryItemDto) : InventoryItemInfoDto => ({ 
            id: item.id!,
            catalogItem: {
                id: item.catalog_item_id! || 'NULL',
                name: item.catalog_item_name || 'NULL',
            },
            total: item.total || 0
        }));
    }

    @LogMethod()
    async getAllByInventoryGroupId(inventoryGroupId: string): Promise<InventoryItemInfoDto[]> {
        const { data, error } = await supaClient.from('inventory_item').select().eq('group_id', inventoryGroupId).select('*, catalog_item(*)');
        if (error) {
            logger.error('Error getting inventory items', error);
            return [];
        }

        return data.map((item) : InventoryItemInfoDto => ({ 
            id: item.id!,
            catalogItem: {
                id: item.catalog_item.id! || 'NULL',
                name: item.catalog_item.name || 'NULL',
            },
            total: item.total || 0
        }));
    }

    @LogMethod()
    async duplicate(id: string): Promise<Result<string, string>> {
        const { data: duplicatedItemId, error } = await supaClient.rpc('duplicate_inventory_item', {
            original_item_id: id
        });

        if (error) {
            logger.error('Error duplicating inventory item from duplicate method', error);
            return failure("No se ha podido obtener el item de inventario para duplicar");
        }
        return success(duplicatedItemId);
    }

}