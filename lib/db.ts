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

type QueryParamsToSqlParams<T> = {
  query: QueryParams<T>,
  selectFields: string,
  tableName: string,
}

export function QueryParamsToSql<T>({ query, selectFields, tableName } : QueryParamsToSqlParams<T>) : { sql: string, values: T[] } {
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