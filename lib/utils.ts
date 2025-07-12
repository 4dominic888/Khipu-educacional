import { Filter, FilterOperator, Pagination, SortOrder } from "@/types/helpers";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
export function buildWhere<T>(filter?: Filter<T>): { sql: string; values: unknown[] } {
  const clauses: string[] = [];
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