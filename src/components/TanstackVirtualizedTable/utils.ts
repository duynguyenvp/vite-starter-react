import { type Column } from '@tanstack/react-table';

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
