import React from "react";

// Define types for better type safety and clarity
type InventoryItem = {
  id: string;
  states: { id: string; condition: string; quantity: number }[];
  [key: string]: any;
};

type Column<T> = {
  id: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
};

interface FlexTableProps<T> {
  data: T[];
  columns: Column<T>[];
  getRowKey: (row: T) => string;
}

function FlexTable<T>({
  data,
  columns,
  getRowKey,
}: FlexTableProps<T>): JSX.Element {
  return (
    <div className="relative w-full overflow-auto">
      {/* Table Header */}
      <div className="flex border-b h-12">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground flex items-center ${
              column.headerClassName || "flex-1 min-w-0"
            }`}
          >
            {column.header}
          </div>
        ))}
      </div>

      {/* Table Body */}
      <div>
        {data.map((row) => (
          <div
            key={getRowKey(row)}
            className="flex border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted py-4 px-4 last:border-0"
          >
            {columns.map((column) => (
              <div
                key={`${getRowKey(row)}-${column.id}`}
                className={`p-4 align-middle ${
                  column.className || "flex-1 min-w-0"
                }`}
              >
                {column.cell(row)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FlexTable;