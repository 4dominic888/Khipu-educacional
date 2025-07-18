import { Filter, QueryParams } from '@/core/shared';

function applyFilter<T>(query: any, filter: Filter<T>): any {
  for (const key in filter) {
    if (key === 'AND' || key === 'OR') continue;

    const { op, value } = filter[key as keyof T]!;

    switch (op) {
      case 'eq':
      case 'neq':
      case 'gt':
      case 'lt':
      case 'in':
        query = query[op](key, value);
        break;
      case 'contains':
        query = query.ilike(key, `%${value}%`);
        break;
    }
  }

  if (filter.AND) {
    const andFilters = filter.AND.map(sub => serializeFilter(sub)).join(',');
    query = query.and(andFilters);
  }

  if (filter.OR) {
    const orFilters = filter.OR.map(sub => serializeFilter(sub)).join(',');
    query = query.or(orFilters);
  }

  return query;
}

function serializeFilter<T>(filter: Filter<T>): string {
  const parts: string[] = [];

  for (const key in filter) {
    if (key === 'AND' || key === 'OR') continue;

    const { op, value } = filter[key as keyof T]!;
    let expression = '';

    switch (op) {
      case 'eq':
        expression = `${key}.eq.${value}`;
        break;
      case 'neq':
        expression = `${key}.neq.${value}`;
        break;
      case 'gt':
        expression = `${key}.gt.${value}`;
        break;
      case 'lt':
        expression = `${key}.lt.${value}`;
        break;
      case 'in':
        expression = `${key}.in.(${value.join(',')})`;
        break;
      case 'contains':
        expression = `${key}.ilike.*${value}*`;
        break;
    }

    parts.push(expression);
  }

  return parts.join(',');
}

export function buildQueryFromParams<T>(
  query: any,
  params?: QueryParams<T>
) {
  if (!params) return query;

  // Aplicar filtros
  if (params.filter) {
    query = applyFilter(query, params.filter);
  }

  // Ordenamiento
  if (params.sort) {
    for (const { field, direction } of params.sort) {
      query = query.order(String(field), { ascending: direction === 'asc' });
    }
  }

  // Paginación
  if (params.pagination) {
    const { page, pageSize } = params.pagination;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
  }

  return query;
}