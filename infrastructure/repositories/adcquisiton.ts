import { CreateAcquisitionDto, Acquisition, EditAcquisitionDto, AcquisitionType } from "@/core/domain";
import { AdcquisitionRepository as AcquisitionRepository } from "@/core/ports/repositories/inventory";
import { Result, QueryParams, failure, success } from "@/core/shared";
import { supabaseClient as supaClient } from "../shared/supabase-client";
import { logger, LogMethod } from "../shared/logger";

export class PostgreInventoryAcquisitionRepository implements AcquisitionRepository {  
    @LogMethod()
    async add(data: CreateAcquisitionDto): Promise<Result<Acquisition, string>> {
        const { data: acquisition, error } = await supaClient.from('acquisition').insert(data).select().single();
        if (error) {
            logger.error('Error adding acquisition', error);
            return failure("No se ha podido añadir la adquisición");
        }
        return success({
            id: acquisition.id,
            type: acquisition.type as AcquisitionType,
            number: acquisition.number,
            date: acquisition.date,
            price: acquisition.price,
        });
    }

    @LogMethod()
    async update(data: EditAcquisitionDto): Promise<Result<Acquisition, string>> {
        const { data: acquisition, error } = await supaClient.from('acquisition').update(data).eq('id', data.id).select().single();
        if (error) {
            logger.error('Error updating acquisition', error);
            return failure("No se ha podido actualizar la adquisición");
        }
        return success({
            id: acquisition.id,
            type: acquisition.type as AcquisitionType,
            number: acquisition.number,
            date: acquisition.date,
            price: acquisition.price,
        });
    }

    @LogMethod()
    async remove(id: string): Promise<Result<string, string>> {
        const { data, error } = await supaClient.from('acquisition').delete().eq('id', id).select('id').single();
        if (error) {
            logger.error('Error removing acquisition', error);
            return failure("No se ha podido eliminar la adquisición");
        }
        return success(data.id);
    }

    @LogMethod()
    async get(id: string): Promise<Acquisition | null> {
        const { data, error } = await supaClient.from('acquisition').select().eq('id', id).single();
        if (error) logger.error('Error getting acquisition', error);
        return error ? null : {
            id: data.id,
            type: data.type as AcquisitionType,
            number: data.number,
            date: data.date,
            price: data.price,
        };
    }
}