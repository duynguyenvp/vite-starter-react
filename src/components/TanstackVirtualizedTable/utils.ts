import { type Column } from '@tanstack/react-table';
import type { HeaderGroup, RowData } from '@tanstack/react-table';

export const getStickyStyle = (
  column: Column<any, any>,
  columns: Column<any, any>[],
  index: number,
) => {
  const sticky = column.columnDef.meta?.sticky;
  const isSticky = sticky === 'left' || sticky === 'right';

  if (!isSticky) return {};

  if (sticky === 'right') {
    const rightOffset = columns.slice(index + 1).reduce((acc, col) => acc + col.getSize(), 0);
    return {
      position: 'sticky',
      right: `${rightOffset}px`,
    };
  }

  const leftOffset = columns.slice(0, index).reduce((acc, col) => acc + col.getSize(), 0);

  return {
    position: 'sticky',
    left: `${leftOffset}px`,
  };
};

export function buildHeaderRowSpanMap<TData extends RowData>(headerGroups: HeaderGroup<TData>[]) {
  const map = new Map<
    string,
    {
      topHeaderId: string;
      rowSpan: number;
    }
  >();

  headerGroups.forEach((group) => {
    group.headers.forEach((header) => {
      const columnId = header.column.id;

      if (!map.has(columnId)) {
        map.set(columnId, {
          topHeaderId: header.id,
          rowSpan: 1,
        });
      } else {
        map.get(columnId)!.rowSpan += 1;
      }
    });
  });

  return map;
}
