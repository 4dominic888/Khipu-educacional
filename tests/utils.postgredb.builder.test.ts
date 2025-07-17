import { buildOrder, buildPagination, buildWhere } from "@/infrastructure/shared/db"
import { Filter, Pagination, SortOrder } from "@/types/helpers";

//* Tipo de dato de prueba para probar este test
type TData = {
    id: number
    name: string
    age: number
    email: string
};

describe('buildWhere should parse SQL sentences', () => {
  test('no filter', () => {
    const result = buildWhere<TData>()
    expect(result.sql).toBe('')
    expect(result.values).toEqual([])
  })

  test('filter with eq', () => {
    const filter: Filter<TData> = { name: { op: 'eq', value: 'Juan' } }
    const result = buildWhere(filter)
    expect(result.sql).toBe('WHERE name = $1')
    expect(result.values).toEqual(['Juan'])
  })

  test('filter with contains and gt', () => {
    const filter: Filter<TData> = {
      name: { op: 'contains', value: 'ana' },
      age: { op: 'gt', value: 18 },
    }
    const result = buildWhere(filter)
    expect(result.sql).toBe('WHERE name ILIKE $1 AND age > $2')
    expect(result.values).toEqual(['%ana%', 18])
  })

  test('filter with in', () => {
    const filter: Filter<TData> = {
      email: { op: 'in', value: ['a@x.com', 'b@x.com'] },
    }
    const result = buildWhere(filter)
    expect(result.sql).toBe('WHERE email = ANY($1)')
    expect(result.values).toEqual([['a@x.com', 'b@x.com']])
  })

  test('filter with nested AND', () => {
    const filter: Filter<TData> = {
      AND: [
        { name: { op: 'contains', value: 'jo' } },
        { age: { op: 'gt', value: 20 } },
      ],
    }
    const result = buildWhere(filter)
    expect(result.sql).toBe('WHERE ((name ILIKE $1) AND (age > $2))')
    expect(result.values).toEqual(['%jo%', 20])
  })

  test('filter with nested OR', () => {
    const filter: Filter<TData> = {
      OR: [
        { name: { op: 'eq', value: 'Ana' } },
        { name: { op: 'eq', value: 'Luis' } },
      ],
    }
    const result = buildWhere(filter)
    expect(result.sql).toBe('WHERE ((name = $1) OR (name = $2))')
    expect(result.values).toEqual(['Ana', 'Luis'])
  })
})

describe('buildOrder should parse SQL sentences', () => {
  test('no order', () => {
    expect(buildOrder<TData>()).toBe('')
  })

  test('just an ascending field', () => {
    const sort: SortOrder<TData>[] = [{ field: 'name', direction: 'asc' }]
    expect(buildOrder(sort)).toBe('ORDER BY name ASC')
  })

  test('mixed fields', () => {
    const sort: SortOrder<TData>[] = [
      { field: 'age', direction: 'desc' },
      { field: 'name', direction: 'asc' },
    ]
    expect(buildOrder(sort)).toBe('ORDER BY age DESC, name ASC')
  })
})

describe('buildPagination should parse SQL sentences', () => {
  test('no pagination', () => {
    expect(buildPagination()).toBe('')
  })

  test('valid pagination', () => {
    const pagination: Pagination = { page: 2, pageSize: 10 }
    expect(buildPagination(pagination)).toBe('LIMIT 10 OFFSET 10')
  })

  test('with minimum safe values', () => {
    const pagination: Pagination = { page: 0, pageSize: 0 }
    expect(buildPagination(pagination)).toBe('LIMIT 1 OFFSET 0')
  })
})