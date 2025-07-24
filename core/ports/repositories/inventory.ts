import { QueryParams, Result } from "@/core/shared";
import {
    CatalogItem,
    InventoryGroup,
    EditInventoryGroupDto,
    InventoryGroupInfoDto,
    CreateInventoryGroupDto,
    InventoryItem,
    EditInventoryItemDto,
    CreateInventoryItemDto,
    VariantInventoryItem,
    EditVariantInventoryItemDto,
    CreateVariantInventoryItemDto,
    InventoryGroupDto,
    Acquisition,
    CreateAcquisitionDto,
    EditAcquisitionDto,
    InventoryItemInfoDto,
} from "@/core/domain";

import {
    RepositoryAddAllable,
    RepositoryCountable,
    RepositoryDuplicable,
    RepositoryFull,
    RepositoryGetAllSummary,
    RepositoryRemovableAllable,
    RepositoryRemovableEverythingable
} from "@/core/shared/repository-base";

/**
 * Repositorio de catálogo de productos.
 * 
 * Solo se encarga de un CRUD sencillo sin más.
 */
export interface CatalogItemRepository extends
    RepositoryFull<CatalogItem, CatalogItem, CatalogItem>,
    RepositoryAddAllable<CatalogItem>,
    RepositoryRemovableAllable,
    RepositoryRemovableEverythingable,
    RepositoryCountable
{

}

/**
 * Repositorio de grupos de inventario.
 * 
 * Solo se encarga de un CRUD sencillo sin más. Pero solo acerca de la información del grupo, pero no de los items que contiene.
 */
export interface InventoryGroupRepository extends
    Omit<RepositoryFull<InventoryGroup, CreateInventoryGroupDto, EditInventoryGroupDto>, "update" | "get" | "getAll">,
    RepositoryGetAllSummary<InventoryGroup, InventoryGroupInfoDto>,
    RepositoryRemovableAllable,
    RepositoryRemovableEverythingable,
    RepositoryDuplicable,
    RepositoryCountable
{
    /**
     * Actualiza la información de un grupo de inventario.
     * @param group Información de actualización del grupo de inventario
     * @returns Resultado de la operación, si tuvo éxito, o un mensaje de error si no.
     */
    updateInformation(group: EditInventoryGroupDto): Promise<Result<InventoryGroupDto, string>>;

    /**
     * Obtiene solo la información del grupo de inventario.
     * @param id ID del grupo de inventario
     * @returns Información del grupo de inventario
     */
    getInfo(id: string): Promise<InventoryGroupInfoDto | null>
}

/**
 * Repositorio de items de inventario.
 * 
 * Solo se encarga de un CRUD sencillo sin más. Pero solo acerca de la información del item, pero no de las variaciones de los items que contiene.
 */
export interface InventoryItemRepository extends 
    Omit<RepositoryFull<InventoryItem, CreateInventoryItemDto, EditInventoryItemDto>, "getAll">,
    RepositoryDuplicable
{
    /**
     * Mueve un item de inventario a otro grupo.
     * @param itemId ID del item a mover
     * @param groupId ID del grupo al que se quiere mover el item
     * @returns Resultado de la operación, si tuvo éxito, o un mensaje de error si no.
     */
    moveToGroup(itemId: string, groupId: string): Promise<Result<boolean, string>>;

    /**
     * Elimina todas las variantes de un item de inventario.
     * @param itemId ID del item de inventario
     * @return Resultado de la operación, si tuvo éxito, o un mensaje de error si no.
     */
    deleteVariants(itemId: string): Promise<Result<boolean, string>>;

    /** 
     * Obtiene todos los items de inventario que pertenecen a un grupo de inventario.
     * @param inventoryGroupId ID del grupo de inventario
     * @returns Lista de items de inventario
     */
    getAllByInventoryGroupId(inventoryGroupId: string): Promise<InventoryItemInfoDto[]>;

    /**
     * Obtiene solo la información del item de inventario.
     * @param id ID del item de inventario
     * @returns Información del item de inventario
     */
    getInfo(id: string): Promise<InventoryItemInfoDto | null>;

    /**
     * Obtiene todos los items de inventario.
     * @param query Parametros de búsqueda
     * @returns Lista de items de inventario
     */
    getAll(query?: QueryParams<InventoryItem> | undefined): Promise<InventoryItemInfoDto[]>
}

/**
 * Repositorio de variantes de items de inventario.
 * 
 * Solo se encarga de un CRUD sencillo sin más.
 */
export interface VariantInventoryItemRepository extends
    Omit<RepositoryFull<VariantInventoryItem, CreateVariantInventoryItemDto, EditVariantInventoryItemDto>, "getAll" | "add" | "update">,
    RepositoryDuplicable
{

    /** 
     * Añade una variante de item de inventario.
     * @param data Datos de la variante de item de inventario
     * @returns ID de la variante de item de inventario
     */
    add(data: CreateVariantInventoryItemDto): Promise<Result<string, string>>;

    /**
     * Actualiza una variante de item de inventario.
     * @param data Datos de la variante de item de inventario
     * @returns Resultado de la operación, si tuvo éxito, o un mensaje de error si no.
     */
    update(data: EditVariantInventoryItemDto): Promise<Result<boolean, string>>;

    /**
     * Obtiene todos los items de inventario que pertenecen a un grupo de inventario.
     * @param inventoryItemId ID del item de inventario
     * @returns Lista de variantes de items de inventario
     */
    getAllByInventoryItemId(inventoryItemId: string): Promise<VariantInventoryItem[]>;
}