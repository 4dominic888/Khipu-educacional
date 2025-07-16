import { ReadableFile, Result } from "@/core/shared";

export interface CatalogTemplateProvider {
    /**
     * Obtiene el archivo de plantilla de catálogo manual de algún lugar en el almacenamiento.
     * @returns Archivo de plantilla de catálogo manual.
     */
    getDefaultCatalogTemplate(): Promise<ReadableFile>;

    /**
     * Actualiza el archivo de plantilla por defecto mandado por el usuario.
     * @param file Archivo de plantilla de catálogo ingresado manualmente.
     */
    updateManualCatalogTemplate(file: ReadableFile): Promise<Result<string, string>>;

    /**
     * Actualiza el archivo de plantilla de catálogo, si es que una actualización trajo alguna modificación.
     */
    updateDefaultCatalogTemplate(): Promise<Result<string, string>>;
}