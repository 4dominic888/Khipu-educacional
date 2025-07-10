type FilterOperator = 'eq' | 'neq' | 'gt' | 'lt' | 'in' | 'contains';

type FieldFilter<T> = {
  [K in keyof T]?: {
    op: FilterOperator;
    value: any;
  }
};

type LogicalFilter<T> = {
  AND?: Filter<T>[];
  OR?: Filter<T>[];
};

export type Filter<T> = FieldFilter<T> & LogicalFilter<T>;