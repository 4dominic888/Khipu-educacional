import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';
import { QueryParams } from '@/types/helpers';
import { buildOrder, buildPagination, buildWhere } from './utils';

dotenv.config({ quiet: true });

export const pool = new Pool({
  connectionString: process.env.DB_URL
})

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

export function rawQueryParamsToSQL<T>({ rawQuery, selectFields = '*', tableName, defaultQuery } : rawQueryParamsToSQLParams<T>) : { sql: string, values: T[] } {

  let query: QueryParams<T> = defaultQuery;

  try {
      if (rawQuery) {
          const parsed = JSON.parse(decodeURIComponent(rawQuery));
          query = {
              filter: parsed.filter ?? query.filter,
              sort: parsed.sort ?? query.sort,
              pagination: parsed.pagination ?? query.pagination
          }
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