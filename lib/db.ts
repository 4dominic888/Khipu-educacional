import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';
import { Filter, FilterOperator, Pagination, QueryParams, SortOrder } from '@/types/helpers';

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

/**
 * Función auxiliar para obtener el método de transacción adecuado según la URL
 * 
 * La URL puede contener una consulta GET con el parámetro `test=true` para ejecutar las operaciones en modo de prueba.
 * @param req 
 * @returns 
 */
export function getTransactionMethod(req: Request): (fn: (client: PoolClient) => Promise<unknown>) => Promise<unknown> {
  const { searchParams } = new URL(req.url);
  const isTest = searchParams.get('test') === 'true';
  return isTest ? withTestTransaction : withTransaction;
}

type QueryParamsToSqlParams<T> = {
  query: QueryParams<T>,
  selectFields: string,
  tableName: string,
}

/**
 * Genera la cláusula `ORDER BY` de una consulta SQL en base a una lista de campos y dirección.
 *
 * @template T Tipo del objeto para validar claves de ordenamiento.
 * @param sort Array de objetos `{ field, direction }` que indican cómo ordenar los resultados.
 *
 * @returns Una cadena `ORDER BY ...` o una cadena vacía si no se proporcionan órdenes.
 *
 * @example
 * const sort = [{ field: 'createdAt', direction: 'desc' }]
 * const sql = buildOrder(sort)
 * // sql: "ORDER BY createdAt DESC"
 */
export function buildOrder<T>(sort?: SortOrder<T>[]): string {
  if (!sort?.length) return ''
  const clauses = sort.map(s => `${String(s.field)} ${s.direction.toUpperCase()}`)
  return `ORDER BY ${clauses.join(', ')}`
}

/**
 * Construye la cláusula `LIMIT` y `OFFSET` de una consulta SQL para paginación.
 *
 * Aplica valores mínimos seguros si no se especifican correctamente (page >= 1, pageSize >= 1).
 *
 * @param pagination Objeto `{ page, pageSize }` indicando la página actual y el tamaño de página.
 *
 * @returns Una cadena `LIMIT ... OFFSET ...` o una cadena vacía si no se proporciona paginación.
 *
 * @example
 * const sql = buildPagination({ page: 2, pageSize: 20 })
 * // sql: "LIMIT 20 OFFSET 20"
 */
export function buildPagination(p?: Pagination): string {
  if (!p) return '';
  const limit = Math.max(1, p.pageSize ?? 50);
  const offset = Math.max(0, (p.page - 1) * limit);
  return `LIMIT ${limit} OFFSET ${offset}`;
}

/**
 * Construye la cláusula `WHERE` de una consulta SQL a partir de filtros dinámicos tipados.
 *
 * Soporta filtros por campo (`eq`, `neq`, `gt`, `lt`, `in`, `contains`) y combinaciones
 * lógicas anidadas con `AND` y `OR`, generando SQL seguro con parámetros (`$1`, `$2`, ...).
 *
 * @template T Tipo del objeto al que se aplica el filtro (por ejemplo, `User`, `Product`, etc).
 * @param filter Objeto de tipo `Filter<T>` que define las condiciones de búsqueda.
 *
 * @returns Un objeto `{ sql, values }` donde:
 * - `sql`: string de la cláusula `WHERE` (o cadena vacía si no hay filtros).
 * - `values`: array de valores a pasar como parámetros en una consulta `pg.query(sql, values)`.
 *
 * @example
 * const filter = { name: { op: 'contains', value: 'ana' }, age: { op: 'gt', value: 18 } }
 * const { sql, values } = buildWhere(filter)
 * // sql: "WHERE name ILIKE $1 AND age > $2"
 * // values: ["%ana%", 18]
 */
export function buildWhere<T>(filter?: Filter<T>): { sql: string; values: any[] } {
  const values: unknown[] = [];
  let paramIndex = 1;

  const parseField = (field: keyof T, condition: { op: FilterOperator; value: unknown }) => {
    const fieldName = String(field);
    switch (condition.op) {
      case 'eq':
        values.push(condition.value);
        return `${fieldName} = $${paramIndex++}`;
      case 'neq':
        values.push(condition.value);
        return `${fieldName} <> $${paramIndex++}`;
      case 'gt':
        values.push(condition.value);
        return `${fieldName} > $${paramIndex++}`;
      case 'lt':
        values.push(condition.value);
        return `${fieldName} < $${paramIndex++}`;
      case 'in':
        values.push(condition.value);
        return `${fieldName} = ANY($${paramIndex++})`;
      case 'contains':
        values.push(`%${condition.value}%`);
        return `${fieldName} ILIKE $${paramIndex++}`;
      default:
        throw new Error(`Operador inválido: ${condition.op}`);
    }
  }

  const processFilter = (f: Filter<T>): string => {
    const parts: string[] = [];

    for (const key in f) {
      if (key === 'AND' || key === 'OR') {
        const group = (f as any)[key] as Filter<T>[];
        const sub = group.map(subFilter => `(${processFilter(subFilter)})`).join(` ${key} `);
        parts.push(`(${sub})`);
      } else {
        const field = key as keyof T;
        const condition = (f as any)[field];
        if (condition?.op && condition?.value !== undefined) {
          parts.push(parseField(field, condition));
        }
      }
    }

    return parts.join(' AND ');
  }

  const sqlBody = filter ? processFilter(filter) : '';
  return {
    sql: sqlBody ? `WHERE ${sqlBody}` : '',
    values,
  }
}

/**
 * Función auxiliar para generar una consulta SQL de SELECT en base a un objeto de tipo `QueryParams<T>`.
 * @param param0 Un objeto que lleva los siguientes campos:
 * - `query`: objeto de tipo `QueryParams<T>` que contiene los filtros, ordenamientos y paginación.
 * - `selectFields`: string con los campos a seleccionar.
 * - `tableName`: string con el nombre de la tabla.
 * @returns Un objeto `{ sql, values }` donde:
 * - `sql`: string de la consulta SQL.
 * - `values`: array de valores a pasar como parámetros en una consulta `pg.query(sql, values)`.
 */
export function SelectQueryParamsToSql<T>({ query, selectFields, tableName } : QueryParamsToSqlParams<T>) : { sql: string, values: T[] } {
  const where = buildWhere(query.filter);
  const order = buildOrder(query.sort);
  const pagination = buildPagination(query.pagination);

  const sqlQuery = `
      SELECT ${selectFields} FROM ${tableName}
      ${where.sql}
      ${order}
      ${pagination}`
  ;

  return { sql: sqlQuery, values: where.values };
}