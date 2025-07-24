import { EditInventoryGroupDto, InventoryGroup, CreateInventoryGroupDto, InventoryGroupInfoDto, InventoryGroupDto, InventoryItem, InventoryItemDto } from "@/core/domain";
import { InventoryGroupRepository } from "@/core/ports/repositories/inventory";
import { Result, QueryParams, failure, success } from "@/core/shared";
import { supabaseClient as supaClient } from "../shared/supabase-client";
import { logger, LogMethod } from "../shared/logger";
import { buildQueryFromParams } from "../shared/supabase-extra";
import { postgreDefaultErrorMessage } from "../shared/postgre-error-messages";

export class PostgreInventoryGroupRepository implements InventoryGroupRepository {
    
    @LogMethod()
    async updateInformation(group: EditInventoryGroupDto): Promise<Result<InventoryGroupDto, string>> {
        const { data: groupEdited, error } = await supaClient.rpc('edit_group', {
            inventory_group_id_to_edit: group.id,
            group_value: {
                name: group.name || null,
                description: group.description || null,
                period: group.period || null
            }
        });

        if (error) {
            logger.error('Error updating inventory group', error);
            if(error.code === 'PGRST116') return failure("No se ha podido actualizar el elemento");
            return failure(postgreDefaultErrorMessage(error));
        }

        return success<InventoryGroupDto>({
            id: groupEdited.id,
            name: groupEdited.name,
            description: groupEdited.description || undefined,
            period: groupEdited.period
        });
    }

    @LogMethod()
    async add(data: CreateInventoryGroupDto): Promise<Result<InventoryGroup, string>> {
        const { data: group, error } = await supaClient.from('inventory_group').insert(data).select().single();
        if (error) {
            logger.error('Error adding inventory group', error);
            return failure(postgreDefaultErrorMessage(error));
        }
        return success({
            id: group.id,
            name: group.name,
            description: group.description || undefined,
            period: group.period,
            items: []
        });
    }

    @LogMethod()
    async remove(id: string): Promise<Result<string, string>> {
        const { data, error } = await supaClient.from('inventory_group').delete().eq('id', id).select('id').single();
        if (error) {
            logger.error('Error removing inventory group', error);
            return failure(postgreDefaultErrorMessage(error));
        }
        return success(data.id);
    }

    @LogMethod()
    async getInfo(id: string): Promise<InventoryGroupInfoDto | null> {
        const { data: group, error } = await supaClient.from('inventory_group_info').select('*').eq('id', id).single();
        if (error) {
            logger.error('Error getting inventory group', error);
            return null;
        }

        return {
            id: group.id!,
            name: group.name!,
            description: group.description || undefined,
            period: group.period!,
            count: group.count!,
        }

    }

    @LogMethod()
    async getAllSummary(query?: QueryParams<InventoryGroup> | undefined): Promise<InventoryGroupInfoDto[]> {
        const { data, error } = await buildQueryFromParams(supaClient.from('inventory_group_info').select(), query);
        if (error) {
            logger.error('Error getting inventory groups', error);
            return [];
        }

        return data.map((group: any) : InventoryGroupInfoDto => ({ 
            id: group.id!,
            name: group.name!,
            description: group.description || undefined,
            period: group.period!,
            count: group.count!,
        }));
    }

    @LogMethod()
    async removeAll(ids: string[]): Promise<Result<number, string>> {
        const { error, count } = await supaClient.from('inventory_group').delete().in('id', ids);
        if (error) {
            logger.error('Error removing inventory groups', error);
            return failure(postgreDefaultErrorMessage(error));
        }

        if(!count) {
            logger.error('Error removing inventory groups', error);
            return failure("No se ha eliminado ningún grupo de inventario");
        }

        return success(count);
    }

    @LogMethod()
    async removeEverything(): Promise<Result<number, string>> {
        const { error, count } = await supaClient.from('inventory_group').delete().select('id').single();
        if (error) {
            logger.error('Error removing inventory groups', error);
            return failure(postgreDefaultErrorMessage(error));
        }

        if(!count) {
            logger.error('Error removing inventory groups', error);
            return failure("No se ha eliminado ningún grupo de inventario");
        }

        return success(count);
    }

    @LogMethod()
    async duplicate(id: string): Promise<Result<string, string>> {
        const { data: newDuplicatedId, error } = await supaClient.rpc('duplicate_group', { original_group_id: id });
        if (error) {
            logger.error('Error duplicating inventory group', error);
            return failure(postgreDefaultErrorMessage(error));
        }
        return success(newDuplicatedId);
    }

    @LogMethod()
    async count(): Promise<Result<number, string>> {
        const { count, error } = await supaClient.from('inventory_group').select('*', { count: 'exact', head: true });
        if (error) {
            logger.error('Error getting inventory groups count', error);
            return failure(postgreDefaultErrorMessage(error));
        }

        if(!count) {
            logger.error('Error getting inventory groups count', count);
            return failure("No se ha podido obtener el número de grupos de inventario");
        }

        return success(count);
    }

}