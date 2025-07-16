import { Result } from "@/core/shared";
import {
    CatalogItem,
    InventoryGroup,
    InventoryGroupEditable,
    InventoryGroupInfo,
    InventoryGroupToAdd,
    InventoryItem,
    InventoryItemEditable,
    InventoryItemToAdd,
    VariantInventoryItem,
    VariantInventoryItemEditable,
    VariantInventoryItemToAdd,
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
    Omit<RepositoryFull<InventoryGroup, InventoryGroupToAdd, InventoryGroupEditable>, "update">,
    RepositoryGetAllSummary<InventoryGroup, InventoryGroupInfo>,
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
    updateInformation(group: InventoryGroupEditable): Promise<Result<InventoryGroup, string>>;
}

/**
 * Repositorio de items de inventario.
 * 
 * Solo se encarga de un CRUD sencillo sin más. Pero solo acerca de la información del item, pero no de las variaciones de los items que contiene.
 */
export interface InventoryItemRepository extends 
    RepositoryFull<InventoryItem, InventoryItemToAdd, InventoryItemEditable>,
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
     * @return Resultado de la operación, si tuvo éxito, o un mensaje de error si no.
     */
    deleteVariants(): Promise<Result<boolean, string>>;
}

/**
 * Repositorio de variantes de items de inventario.
 * 
 * Solo se encarga de un CRUD sencillo sin más.
 */
export interface VariantInventoryItemRepository extends
    RepositoryFull<VariantInventoryItem, VariantInventoryItemToAdd, VariantInventoryItemEditable>,
    RepositoryDuplicable
{

}