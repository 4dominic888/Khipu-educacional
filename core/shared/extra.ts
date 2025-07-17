/**
 * Para obligar a que un objeto tenga al menos una propiedad.
 */
export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>
}[keyof T]

/**
 * Tipo de formato para manejar archivos.
 *
 * @property name Nombre del archivo
 * @property content Contenido del archivo
 * @property mimeType Tipo de contenido del archivo
 */
export interface ReadableFile {
  name: string;
  content: Buffer | string;
  mimeType?: string;
}