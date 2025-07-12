import { QueryParams, Result } from "@/types/helpers";
import { Pool, PoolClient } from "pg";

/**
 * Base genérica para repositorios de datos.
 *
 * @template T Tipo de dato completo (ej: entidad con ID)
 * @template K Tipo de dato resumen (usado por ejemplo en `getAll()`)
 * @template V Tipo de entrada (usado para `add()` normalmente sin ID)
 */
interface RepositoryTypes<T, K, V> {}

/**
 * Base genérica para repositorios de datos.
 */
interface RepositoryBase { readonly db: Pool | PoolClient } 

/** Operación de agregar */
interface RepositoryAddable<T, V> extends RepositoryTypes<T, any, V> {
  add(data: V): Promise<Result<T, string>>;
}

/** 
 * Operación de actualizar
 * 
 * El dato a actualizar necesita ser completo y tener una ID definida y existente en la BD.
*/
interface RepositoryUpdatable<T> extends RepositoryTypes<T, any, any> {
  update(data: T): Promise<Result<T, string>>;
}

/** Operación de eliminar */
interface RepositoryRemovable {
  remove(id: string): Promise<Result<null, string>>;
}

/** Obtener una entidad por ID */
interface RepositoryGetOne<T> extends RepositoryTypes<T, any, any> {
  get(id: string): Promise<T | null>;
}

/** Obtener todas las entidades pero no llamando todos sus atributos */
interface RepositoryGetAllSummary<T, K> extends RepositoryTypes<T, K, any> {
  getAllSummary(query?: QueryParams<T>): Promise<K[]>;
}

/** Obtener todas las entidades llamando todos sus atributos */
interface RepositoryGetAll<T> extends RepositoryTypes<T, any, any> {
  getAll(query?: QueryParams<T>): Promise<T[]>;
}

////////////////////////////////////////////////////////////////////////////////////////////////////

/** Repositorio de lectura y escritura */
export type RepositoryFull<T, K, V> =
  RepositoryBase &
  RepositoryAddable<T, V> &
  RepositoryUpdatable<T> &
  RepositoryRemovable &
  RepositoryGetOne<T> &
  RepositoryGetAllSummary<T, K> &
  RepositoryGetAll<T>;

/** Repositorio de lectura y escritura */
export type RepositorySimple<T> =
  RepositoryBase &
  RepositoryAddable<T, T> &
  RepositoryUpdatable<T> &
  RepositoryRemovable &
  RepositoryGetOne<T> &
  RepositoryGetAll<T>;

/** Repositorio de solo lectura */
export type RepositoryReadOnly<T, K> =
  RepositoryBase &
  RepositoryGetOne<T> &
  RepositoryGetAllSummary<T, K> &
  RepositoryGetAll<T>;
