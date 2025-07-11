/**
 * Operadores de filtro válidos.
 * 
 * - `eq`: Igual a
 * - `neq`: Distinto de
 * - `gt`: Mayor que
 * - `lt`: Menor que
 * - `in`: Dentro de un conjunto de valores
 * - `contains`: Contiene una subcadena o valor parcial
 */
export type FilterOperator = 'eq' | 'neq' | 'gt' | 'lt' | 'in' | 'contains';

/**
 * Filtro por campos individuales.
 * Cada campo del objeto puede tener una condición con un operador y un valor.
 *
 * @example
 * {
 *   name: { op: 'contains', value: 'juan' },
 *   age: { op: 'gt', value: 18 }
 * }
 */
export type FieldFilter<T> = {
  [K in keyof T]?: {
    op: FilterOperator;
    value: any; // Puede refinarse con genéricos si se desea tipar mejor
  };
};

/**
 * Permite combinar múltiples filtros usando lógica booleana.
 *
 * @example
 * {
 *   AND: [{ age: { op: 'gt', value: 18 } }, { age: { op: 'lt', value: 65 } }]
 * }
 */
export type LogicalFilter<T> = {
  AND?: Filter<T>[];
  OR?: Filter<T>[];
};

/**
 * Filtro completo que puede incluir condiciones por campos y filtros lógicos anidados.
 */
export type Filter<T> = FieldFilter<T> & LogicalFilter<T>;

/**
 * Especifica el ordenamiento de los resultados.
 *
 * @example
 * [
 *   { field: 'createdAt', direction: 'desc' },
 *   { field: 'name', direction: 'asc' }
 * ]
 */
export type SortOrder<T> = {
  field: keyof T;
  direction: 'asc' | 'desc';
};

/**
 * Opciones de paginación para limitar los resultados.
 *
 * - `page`: número de página (empieza en 1)
 * - `pageSize`: cantidad de elementos por página
 */
export type Pagination = {
  page: number;
  pageSize: number;
};

/**
 * Parámetros completos de consulta que incluyen:
 * - Filtros
 * - Ordenamiento
 * - Paginación
 */
export type QueryParams<T> = {
  filter?: Filter<T>;
  sort?: SortOrder<T>[];
  pagination?: Pagination;
};
