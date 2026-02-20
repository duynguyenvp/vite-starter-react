import type { ColumnDef, RowData } from '@tanstack/react-table';
import '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    sticky?: 'left' | 'right';
  }
}

export interface TableProps<TData extends RowData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  isLoading?: boolean;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}
