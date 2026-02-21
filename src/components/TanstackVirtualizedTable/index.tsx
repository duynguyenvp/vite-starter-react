import { useRef, useCallback } from 'react';
import { useReactTable, getCoreRowModel, flexRender, type RowData } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { TableProps } from './types';
import { buildHeaderRowSpanMap, getStickyStyle } from './utils';

export default function TanstackVirtualizedTable<TData extends RowData>({
  data,
  columns,
  isLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: TableProps<TData>) {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data: isLoading && data.length === 0 ? [] : data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();
  const headerGroups = table.getHeaderGroups();
  const totalHeaderRows = headerGroups.length;
  const leafColumns = table.getVisibleLeafColumns();

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? rows.length + 1 : rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 48,
    overscan: 10,
  });

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        if (
          scrollHeight - scrollTop - clientHeight < 300 &&
          !isFetchingNextPage &&
          hasNextPage &&
          fetchNextPage
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  const headerSpanMap = buildHeaderRowSpanMap(headerGroups);

  return (
    <div className="flex flex-col w-full p-4">
      <div
        ref={tableContainerRef}
        onScroll={(e) => fetchMoreOnBottomReached(e.currentTarget as HTMLDivElement)}
        className="relative h-[600px] w-full overflow-auto border border-slate-200 rounded-xl bg-white shadow-md scrollbar-thin"
        role="table"
      >
        <div className="min-w-full inline-block">
          <div
            className="sticky top-0 z-30 flex flex-col border-b border-slate-200 bg-slate-50"
            role="rowgroup"
          >
            <div
              className="grid"
              style={{
                gridTemplateColumns: leafColumns.map((c) => `${c.getSize()}px`).join(' '),
                gridTemplateRows: `repeat(${totalHeaderRows}, auto)`,
              }}
              role="row"
            >
              {headerGroups.flatMap((headerGroup) => (
                <>
                  {headerGroup.headers.map((header) => {
                    const spanInfo = headerSpanMap.get(header.column.id);

                    // Skip mọi header không phải top header
                    if (spanInfo?.topHeaderId !== header.id) return null;

                    const rowSpan = spanInfo?.rowSpan ?? 1;

                    const stickyStyle = getStickyStyle(header.column, leafColumns, header.index);

                    return (
                      <div
                        key={header.id}
                        role="columnheader"
                        className={`flex items-center justify-center px-4 py-3 border-r border-b font-bold text-xs uppercase 
                        ${Object.keys(stickyStyle).length > 0 ? 'z-40 bg-slate-200' : ''}
                      `}
                        style={{
                          gridArea: `span ${rowSpan} / span ${header.colSpan}`,
                          ...(stickyStyle as React.CSSProperties),
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          </div>

          <div
            className="relative w-full"
            style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
            role="rowgroup"
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const isLoaderRow = virtualRow.index > rows.length - 1;
              const row = rows[virtualRow.index];

              return (
                <div
                  key={virtualRow.key}
                  role="row"
                  className="grid absolute top-0 left-0 w-full border-b border-slate-100 hover:bg-indigo-50/30"
                  style={{
                    gridTemplateColumns: table
                      .getVisibleLeafColumns()
                      .map((c) => `${c.getSize()}px`)
                      .join(' '),
                    transform: `translateY(${virtualRow.start}px)`,
                    height: `${virtualRow.size}px`,
                  }}
                >
                  {isLoaderRow ? (
                    <div className="col-span-full flex items-center justify-center py-2 text-sm italic">
                      Đang tải thêm...
                    </div>
                  ) : (
                    row.getVisibleCells().map((cell, index) => {
                      const stickyStyle = getStickyStyle(cell.column, leafColumns, index);
                      return (
                        <div
                          key={cell.id}
                          role="cell"
                          className={`flex items-center px-4 py-2 text-sm text-slate-600 ${
                            Object.keys(stickyStyle).length > 0 ? 'z-30 bg-white border-r' : ''
                          }`}
                          style={{ ...(stickyStyle as React.CSSProperties) }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      );
                    })
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
