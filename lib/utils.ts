import { Filter, FilterOperator, Pagination, SortOrder } from "@/types/helpers";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildOrder<T>(sort?: SortOrder<T>[]): string {
  if (!sort?.length) return ''
  const clauses = sort.map(s => `${String(s.field)} ${s.direction.toUpperCase()}`)
  return `ORDER BY ${clauses.join(', ')}`
}

export function buildPagination(p?: Pagination): string {
  if (!p) return '';
  const limit = Math.max(1, p.pageSize ?? 50);
  const offset = Math.max(0, (p.page - 1) * limit);
  return `LIMIT ${limit} OFFSET ${offset}`;
}

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