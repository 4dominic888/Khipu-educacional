import { CatalogItem } from "@/core/domain";
import { ReadableFile, Result } from "@/core/shared";

export interface CatalogImporter {
    /**
     * Importa un archivo en formato Excel para recuperar la información del catálogo de productos.
     * @param file Archivo en formato Excel
     * @returns Resultado de la importación, si tuvo éxito, o un mensaje de error si no.
     */
    importFromExcel(file: ReadableFile): Promise<Result<CatalogItem[], string>>;

    /**
     * Valida el formato del archivo que sea correcto para poder importarse.
     * @param file El archivo a validar
     * @returns Resultado de la validación, si tuvo éxito, o un mensaje de error si no.
     */
    validateFormat(file: ReadableFile): Promise<Result<boolean, string>>;

    /**
     * Verifica si hay errores a las hora de importar los datos del catalogo.
     * 
     * e.g "Hay menos datos de los productos del catálogo que en la base de datos actual"
     * 
     * Solo podrá pasar si el nuevo archivo solo agrega más datos, es igual o solo hay cambios en nombres.
     * @param file 
     */
    checkImportTroubles(file: CatalogItem[]): Promise<Result<boolean, string>>;
}