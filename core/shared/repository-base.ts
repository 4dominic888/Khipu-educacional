import { Result } from "./result";
import { QueryParams } from "./filter";

/**
 * Base genérica para repositorios de datos.
 *
 * @template T Tipo de dato completo (ej: entidad con ID)
 * @template K Tipo de dato resumen (usado por ejemplo en `getAll()`)
 * @template V Tipo de dato para registros (usado para `add()` normalmente sin ID)
 * @template U Tipo de dato para ediciones parciales (usado para `update()` donde todos los campos son opcionales menos el ID)
 */
interface RepositoryTypes<T, K, V, U> {}

//TODO interface RepositoryBase {  readonly db: Pool | PoolClient }  


/**
 * Tipo de repositorio para agregar elementos
 * 
 * Provee un método `add()` para agregar un elemento.
 * 
 * @template T Tipo de dato completo (ej: entidad con ID)
 * @template V Tipo de dato para registros (usado para `add()` normalmente sin ID)
 * 
 * El método `add()` es asincrónico y toma por parámetro un elemento de tipo `V`.
 * 
 * Retorna un `Result<T, string>` con el mismo elemento si la operación tuvo éxito, o un mensaje de error si no.
*/
export interface RepositoryAddable<T, V> extends RepositoryTypes<T, any, V, any> {
  add(data: V): Promise<Result<T, string>>;
}

/**
 * Tipo de repositorio para agregar más de un elemento
 * 
 * Provee un método `addAll()` para agregar muchos elementos.
 * 
 * @template T Tipo de dato completo (ej: entidad con ID)
 * 
 * El método `addAll()` es asincrónico y toma por parámetro un elemento de tipo `T[]`.
 * 
 * Retorna un `Result<number, string>` con la cantidad de elementos agregados si la operación tuvo éxito, o un mensaje de error si no.
*/
export interface RepositoryAddAllable<T> extends RepositoryTypes<T, any, any, any> {
  addAll(data: T[]): Promise<Result<number, string>>;
}

/**
 * Tipo de repositorio para editar un elemento
 * 
 * Provee un método `update()` para editar un solo elemento.
 * 
 * @template T Tipo de dato completo (ej: entidad con ID)
 * @template U Tipo de dato para ediciones parciales (usado para `update()` donde todos los campos son opcionales menos el ID)
 * 
 * El método `update()` es asincrónico y toma por parámetro un elemento de tipo `U`.
 * 
 * Retorna un `Result<T, string>` con el elemento creado `T` si la operación tuvo éxito, o un mensaje de error si no.
*/
export interface RepositoryUpdatable<T, U> extends RepositoryTypes<T, any, any, U> {
  update(data: U): Promise<Result<T, string>>;
}

/**
 * Tipo de repositorio para editar más de un elemento
 * 
 * Provee un método `updateAll()` para editar muchos elementos.
 * 
 * @template T Tipo de dato completo (ej: entidad con ID)
 * @template U Tipo de dato para ediciones parciales (usado para `update()` donde todos los campos son opcionales menos el ID)
 * 
 * El método `updateAll()` es asincrónico y toma por parámetro un elemento de tipo `U[]`.
 * 
 * Retorna un `Result<number, string>` con la cantidad de elementos editados si la operación tuvo éxito, o un mensaje de error si no.
 */
export interface RepositoryUpdatableAllable<T, U> extends RepositoryTypes<T, any, any, U> {
  updateAll(data: U[]): Promise<Result<number, string>>;
}

/**
 * Tipo de repositorio para eliminar un solo elemento.
 * 
 * Provee un método `remove()` para eliminar un elemento.
 * 
 * El método `remove()` es asincrónico y toma por parámetro un elemento de tipo `string` haciendo referencia al ID del elemento a eliminar.
 * 
 * Retorna un `Result<string, string>` con el ID del elemento eliminado si la operación tuvo éxito, o un mensaje de error si no.
*/
export interface RepositoryRemovable {
  remove(id: string): Promise<Result<string, string>>;
}

/**
 * Tipo de repositorio para eliminar más de un elemento.
 * 
 * Provee un método `removeAll()` para eliminar muchos elementos.
 * 
 * El método `removeAll()` es asincrónico y toma por parámetro un elemento de tipo `string[]` haciendo referencia a los IDs de los elementos a eliminar.
 * 
 * Retorna un `Result<number, string>` con la cantidad de elementos eliminados si la operación tuvo éxito, o un mensaje de error si no.
*/
export interface RepositoryRemovableAllable {
  removeAll(ids: string[]): Promise<Result<number, string>>;
  removeEverything(): Promise<Result<number, string>>;
}

/**
 * Tipo de repositorio para eliminar todos los elementos.
 * 
 * Provee un método `removeEverything()` para eliminar todos los elementos.
 * 
 * El método `removeEverything()` es asincrónico y toma por parámetro un elemento de tipo `string[]` haciendo referencia a los IDs de los elementos a eliminar.
 * 
 * Retorna un `Result<number, string>` con la cantidad de elementos eliminados si la operación tuvo éxito, o un mensaje de error si no.
*/
export interface RepositoryRemovableEverythingable {
  removeEverything(): Promise<Result<number, string>>;
}

/**
 * Tipo de repositorio para obtener un elemento por ID.
 * 
 * Provee un método `get()` para obtener un elemento.
 * 
 * @template T Tipo de dato completo (ej: entidad con ID)
 * 
 * El método `get()` es asincrónico y toma por parámetro un elemento de tipo `string` haciendo referencia al ID del elemento a obtener.
 * 
 * Retorna un `Result<T, string>` con el elemento `T` si la operación tuvo éxito, o un mensaje de error si no.
 */
export interface RepositoryGetOne<T> extends RepositoryTypes<T, any, any, any> {
  get(id: string): Promise<T | null>;
}

/**
 * Tipo de repositorio para obtener todas las entidades pero no llamando todos sus atributos, (Modo resumen).
 * 
 * Provee un método `getAllSummary()` para obtener todas las entidades pero no llamando todos sus atributos.
 * 
 * @template T Tipo de dato completo (ej: entidad con ID)
 * @template K Tipo de dato resumen (usado por ejemplo en `getAll()`)
 * 
 * El método `getAllSummary()` es asincrónico y toma por parámetro un elemento de tipo `QueryParams<T>`, un tipo de objeto que contiene los parámetros de búsqueda.
 * 
 * Retorna un `Result<K[], string>` con un array de `K` si la operación tuvo éxito, o un mensaje de error si no.
 */
export interface RepositoryGetAllSummary<T, K> extends RepositoryTypes<T, K, any, any> {
  getAllSummary(query?: QueryParams<T>): Promise<K[]>;
}

/**
 * Tipo de repositorio para obtener todas las entidades llamando todos sus atributos, (Modo completo).
 * 
 * Provee un método `getAll()` para obtener todas las entidades llamando todos sus atributos.
 * 
 * @template T Tipo de dato completo (ej: entidad con ID)
 * 
 * El método `getAll()` es asincrónico y toma por parámetro un elemento de tipo `QueryParams<T>`, un tipo de objeto que contiene los parámetros de búsqueda.
 * 
 * Retorna un `Result<T[], string>` con un array de `T` si la operación tuvo éxito, o un mensaje de error si no.
 */
export interface RepositoryGetAll<T> extends RepositoryTypes<T, any, any, any> {
  getAll(query?: QueryParams<T>): Promise<T[]>;
}

/**
 * Tipo de repositorio para duplicar un elemento.
 * 
 * Provee un método `duplicate()` para duplicar un elemento.
 * 
 * @template T Tipo de dato completo (ej: entidad con ID)
 * 
 * El método `duplicate()` es asincrónico y toma por parámetro un elemento de tipo `string` haciendo referencia al ID del elemento a duplicar.
 * 
 * Retorna un `Result<string, string>` con el ID del elemento duplicado si la operación tuvo éxito, o un mensaje de error si no.
 */
export interface RepositoryDuplicable {
  duplicate(id: string): Promise<Result<string, string>>;
}

/**
 * Tipo de repositorio para recuperar el número de registros.
 * 
 * Provee un método `count()` para recuperar el número de registros.
 */
export interface RepositoryCountable {
  count(): Promise<Result<number, string>>;
}

////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Repositorio con CRUD completo.
 * 
 * Provee metodos de agregar, actualizar, eliminar y recuperar todos los registros
 * 
 * @template T Tipo de dato completo (ej: entidad con ID)
 * @template V Tipo de dato para registros (usado para `add()` normalmente sin ID)
 * @template U Tipo de dato para ediciones parciales (usado para `update()` donde todos los campos son opcionales menos el ID)
 */
export type RepositoryFull<T, V, U> =
  RepositoryAddable<T, V> &
  RepositoryUpdatable<T, U> &
  RepositoryRemovable &
  RepositoryGetOne<T> &
  RepositoryGetAll<T>;


/**
 * Repositorio de solo lectura.
 * 
 * Provee solo métodos de recuperación de datos, tanto de un elemento, de varios mediante filtros o modo de resumen.
 * 
 * @template T Tipo de dato completo (ej: entidad con ID)
 * @template K Tipo de dato resumen (usado por ejemplo en `getAll()`)
 */
export type RepositoryReadOnly<T, K> =
  RepositoryGetOne<T> &
  RepositoryGetAllSummary<T, K> &
  RepositoryGetAll<T>;
