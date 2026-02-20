import React, { useMemo, useRef } from 'react';
import { VariableSizeGrid as Grid } from 'react-window';

type AlignType = 'left' | 'center' | 'right';

export interface VirtualColumn<T = any> {
  title: React.ReactNode;
  dataIndex: keyof T | string;
  key: string;
  width: number;
  render?: (value: any, record: T, rowIndex: number) => React.ReactNode;
  headerRender?: (colIndex: number) => React.ReactNode;
  align?: AlignType;
  fixed?: 'left' | 'right';
}

interface VirtualizedTableProps<T = any> {
  columns: VirtualColumn<T>[];
  dataSource: T[];
  width: number;
  height: number;
  rowHeight?: number;
  headerHeight?: number;
}

export function VirtualizedTable<T extends object>({
  columns,
  dataSource,
  width,
  height,
  rowHeight = 40,
  headerHeight = 45,
}: VirtualizedTableProps<T>) {
  const leftColumns = useMemo(() => columns.filter((c) => c.fixed === 'left'), [columns]);
  const rightColumns = useMemo(() => columns.filter((c) => c.fixed === 'right'), [columns]);
  const centerColumns = useMemo(() => columns.filter((c) => !c.fixed), [columns]);

  const leftWidth = leftColumns.reduce((s, c) => s + c.width, 0);
  const rightWidth = rightColumns.reduce((s, c) => s + c.width, 0);
  const centerWidth = width - leftWidth - rightWidth;

  const gridHeight = height - headerHeight;

  const mainGridRef = useRef<Grid>(null);
  const leftGridRef = useRef<Grid>(null);
  const rightGridRef = useRef<Grid>(null);
  const centerHeaderRef = useRef<HTMLDivElement>(null);
  const scrollTopRef = useRef<number>(0);
  const scrollLeftRef = useRef<number>(0);

  const syncScroll = ({ scrollTop, scrollLeft }: any) => {
    // Update refs
    scrollTopRef.current = scrollTop;
    scrollLeftRef.current = scrollLeft;

    // Update CSS variable directly instead of state for smooth 60fps
    if (centerHeaderRef.current) {
      centerHeaderRef.current.style.setProperty('--scroll-left', `-${scrollLeft}px`);
    }

    // Sync both grids - left/right only sync vertical, center syncs both
    leftGridRef.current?.scrollTo({ scrollTop });
    rightGridRef.current?.scrollTo({ scrollTop });
  };

  const syncVerticalScroll = ({ scrollTop }: any) => {
    // Sync vertical scroll from left/right grids to center grid
    // Keep the horizontal scroll position
    scrollTopRef.current = scrollTop;
    mainGridRef.current?.scrollTo({ scrollTop, scrollLeft: scrollLeftRef.current });
  };

  const renderCell =
    (cols: VirtualColumn<T>[]) =>
    ({ columnIndex, rowIndex, style }: any) => {
      const column = cols[columnIndex];
      const record = dataSource[rowIndex];
      const value = (record as any)[column.dataIndex];

      const content = column.render ? column.render(value, record, rowIndex) : value;

      return (
        <div
          style={{
            ...style,
            boxSizing: 'border-box',
            borderRight: '1px solid #f0f0f0',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              column.align === 'right'
                ? 'flex-end'
                : column.align === 'center'
                  ? 'center'
                  : 'flex-start',
            padding: '0 8px',
            background: rowIndex % 2 === 0 ? '#fff' : '#fafafa',
          }}
        >
          {content}
        </div>
      );
    };

  const renderHeader = (
    cols: VirtualColumn<T>[],
    offsetLeft = 0,
    shouldScroll = false,
    containerWidth?: number,
  ) => {
    const innerWidth = cols.reduce((sum, col) => sum + col.width, 0);
    const displayWidth = shouldScroll && containerWidth ? containerWidth : undefined;

    return (
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          left: offsetLeft,
          top: 0,
          height: headerHeight,
          zIndex: 3,
          background: '#fafafa',
          overflow: 'hidden',
          width: displayWidth,
        }}
      >
        <div
          style={{
            width: innerWidth,
            display: 'flex',
            transform: shouldScroll ? 'translateX(var(--scroll-left))' : undefined,
          }}
        >
          {cols.map((col) => {
            // Tìm chỉ số thực của cột trong toàn bộ columns array
            const actualIndex = columns.findIndex((c) => c.key === col.key);
            const headerContent = col.headerRender ? col.headerRender(actualIndex) : col.title;

            return (
              <div
                key={col.key}
                style={{
                  width: col.width,
                  height: headerHeight,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 8px',
                  fontWeight: 600,
                  borderRight: '1px solid #f0f0f0',
                  borderBottom: '1px solid #f0f0f0',
                  boxSizing: 'border-box',
                  flexShrink: 0,
                }}
              >
                {headerContent}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        border: '1px solid #f0f0f0',
      }}
    >
      {/* HEADER */}
      {renderHeader(leftColumns, 0, false)}

      {/* CENTER HEADER - with ref for CSS variable update */}
      <div
        ref={centerHeaderRef}
        style={
          {
            display: 'flex',
            position: 'absolute',
            left: leftWidth,
            top: 0,
            height: headerHeight,
            zIndex: 3,
            background: '#fafafa',
            overflow: 'hidden',
            width: centerWidth,
            '--scroll-left': '0px',
          } as React.CSSProperties & { '--scroll-left': string }
        }
      >
        <div
          style={{
            width: centerColumns.reduce((sum, col) => sum + col.width, 0),
            display: 'flex',
            transform: 'translateX(var(--scroll-left))',
            willChange: 'transform',
          }}
        >
          {centerColumns.map((col) => {
            const actualIndex = columns.findIndex((c) => c.key === col.key);
            const headerContent = col.headerRender ? col.headerRender(actualIndex) : col.title;
            return (
              <div
                key={col.key}
                style={{
                  width: col.width,
                  height: headerHeight,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 8px',
                  fontWeight: 600,
                  borderRight: '1px solid #f0f0f0',
                  borderBottom: '1px solid #f0f0f0',
                  boxSizing: 'border-box',
                  flexShrink: 0,
                }}
              >
                {headerContent}
              </div>
            );
          })}
        </div>
      </div>

      {renderHeader(rightColumns, width - rightWidth, false)}

      {/* LEFT GRID */}
      {leftColumns.length > 0 && (
        <Grid
          ref={leftGridRef}
          columnCount={leftColumns.length}
          columnWidth={(i) => leftColumns[i].width}
          height={gridHeight}
          rowCount={dataSource.length}
          rowHeight={() => rowHeight}
          width={leftWidth}
          onScroll={syncVerticalScroll}
          style={{ position: 'absolute', top: headerHeight, left: 0 }}
        >
          {renderCell(leftColumns)}
        </Grid>
      )}

      {/* CENTER GRID */}
      <Grid
        ref={mainGridRef}
        columnCount={centerColumns.length}
        columnWidth={(i) => centerColumns[i].width}
        height={gridHeight}
        rowCount={dataSource.length}
        rowHeight={() => rowHeight}
        width={centerWidth}
        onScroll={syncScroll}
        style={{
          position: 'absolute',
          top: headerHeight,
          left: leftWidth,
        }}
      >
        {renderCell(centerColumns)}
      </Grid>

      {/* RIGHT GRID */}
      {rightColumns.length > 0 && (
        <Grid
          ref={rightGridRef}
          columnCount={rightColumns.length}
          columnWidth={(i) => rightColumns[i].width}
          height={gridHeight}
          rowCount={dataSource.length}
          rowHeight={() => rowHeight}
          width={rightWidth}
          onScroll={syncVerticalScroll}
          style={{
            position: 'absolute',
            top: headerHeight,
            left: width - rightWidth,
          }}
        >
          {renderCell(rightColumns)}
        </Grid>
      )}
    </div>
  );
}
