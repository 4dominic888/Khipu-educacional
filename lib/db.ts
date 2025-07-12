import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';
import { QueryParams } from '@/types/helpers';
import { buildOrder, buildPagination, buildWhere } from './utils';

dotenv.config({ quiet: true });

export const pool = new Pool({
  connectionString: process.env.DB_URL
})

/**
 * Ejecuta una función dentro de una transacción de PostgreSQL que se revierte automáticamente (ROLLBACK).
 * 
 * ⚠️ Útil para pruebas automatizadas (testing), ya que los cambios realizados
 * dentro de la transacción no se guardan en la base de datos.
 *
 * @template T El tipo de dato que retorna la función ejecutada.
 * @param fn Una función asíncrona que recibe un `PoolClient` para ejecutar queries dentro de la transacción.
 * @returns Una promesa con el resultado de la función `fn`.
 *
 * @example
 * await withTestTransaction(async (client) => {
 *   await client.query('INSERT INTO users (name) VALUES ($1)', ['Test']);
 *   const { rows } = await client.query('SELECT * FROM users');
 *   expect(rows.length).toBeGreaterThan(0);
 * });
 */
export async function withTestTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('ROLLBACK');
    return result;
  } finally {
    client.release();
  }
}

/**
 * Ejecuta una función dentro de una transacción de PostgreSQL, con `COMMIT` automático si no hay errores,
 * y `ROLLBACK` en caso de fallo.
 *
 * ⚙️ Útil para operaciones de escritura críticas que requieren atomicidad (crear usuario + log, etc).
 *
 * @template T El tipo de dato que retorna la función ejecutada.
 * @param fn Una función asíncrona que recibe un `PoolClient` para ejecutar queries dentro de la transacción.
 * @returns Una promesa con el resultado de la función `fn`, si todo fue exitoso.
 *
 * @throws Reenvía cualquier error que ocurra dentro de la función `fn` después de hacer `ROLLBACK`.
 *
 * @example
 * await withTransaction(async (client) => {
 *   await client.query('UPDATE users SET active = false WHERE last_login < NOW() - INTERVAL \'1 year\'');
 * });
 */
export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

type rawQueryParamsToSQLParams<T> = {
  rawQuery: string | null,
  selectFields: string,
  tableName: string,
  defaultQuery: QueryParams<T>  
}

/**
 * Convierte un parámetro `query` codificado (string JSON) que originalmente es un `QueryParam` en una consulta SQL completa,
 * aplicando filtros, ordenamiento y paginación sobre una tabla específica.
 *
 * 👉 Útil para endpoints tipo `/api/entidad?query=...` donde se desea generar
 * dinámicamente una consulta PostgreSQL desde el cliente.
 *
 * @template T Tipo del modelo de datos sobre el que se construyen los filtros (ej. User, Product).
 *
 * @param params.rawQuery El valor del parámetro `query` en la URL, codificado con `encodeURIComponent(JSON.stringify(...))`.
 * @param params.selectFields Campos que se desean seleccionar en la consulta (`*` por defecto).
 * @param params.tableName Nombre de la tabla a consultar (debe estar validado previamente si es dinámico).
 * @param params.defaultQuery Consulta por defecto que se aplica si `rawQuery` está vacío o malformado.
 *
 * @returns Un objeto `{ sql, values }` con:
 *   - `sql`: string SQL listo para ejecutar con `pg`
 *   - `values`: array de valores parametrizados que corresponden a la cláusula WHERE
 *
 * @throws Si `rawQuery` no es un JSON válido, lanza un error con mensaje amigable.
 *
 * @example
 * const { sql, values } = rawQueryParamsToSQL<User>({
 *   rawQuery: req.url.searchParams.get('query'),
 *   selectFields: 'id, name',
 *   tableName: 'users',
 *   defaultQuery: {
 *     filter: { active: { op: 'eq', value: true } },
 *     sort: [{ field: 'name', direction: 'asc' }],
 *     pagination: { page: 1, pageSize: 25 },
 *   }
 * })
 *
 * await pool.query(sql, values)
 */
export function rawQueryParamsToSQL<T>({ rawQuery, selectFields = '*', tableName, defaultQuery } : rawQueryParamsToSQLParams<T>) : { sql: string, values: T[] } {

  let query: QueryParams<T> = defaultQuery;

  try {
    if (rawQuery) {
        const parsed = JSON.parse(decodeURIComponent(rawQuery));
        query = {
            filter: parsed.filter ?? query.filter,
            sort: parsed.sort ?? query.sort,
            pagination: parsed.pagination ?? query.pagination
        };
    }
  } catch (error) {
    throw Error('Parámetro de búsqueda inválido');
  }

  const where = buildWhere(query.filter);
  const order = buildOrder(query.sort);
  const pagination = buildPagination(query.pagination);

  const sqlQuery = `
      SELECT ${selectFields} FROM ${tableName}
      ${where.sql}
      ${order}
      ${pagination}`
  ;

  return { sql: sqlQuery, values: [] };

}