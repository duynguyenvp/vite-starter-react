import { useFormContext, Controller } from 'react-hook-form';
import { memo } from 'react';
import type { MatrixData } from './schema';
import InputPriceField from '../../components/InputPriceField';

// Helper: convert formatted price string to number
const parsePrice = (val: string): number => {
  if (!val) return 0;
  // Remove all non-digit characters except minus
  const cleaned = val.replace(/[^\d-]/g, '');
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? 0 : num;
};

const DataCell = memo(
  ({ rowIndex, cellIndex }: { rowIndex: number; cellIndex: number }) => {
    const { control } = useFormContext<MatrixData>();

    return (
      <div className="w-full h-full flex items-center">
        <Controller
          control={control}
          name={`rows.${rowIndex}.cells.${cellIndex}.value` as const}
          defaultValue={0}
          render={({ field: { value, onChange } }) => (
            <InputPriceField
              value={String(value || '')}
              onChange={(val) => onChange(parsePrice(val))}
            />
          )}
        />
      </div>
    );
  },
  (prev, next) => prev.rowIndex === next.rowIndex && prev.cellIndex === next.cellIndex,
);

DataCell.displayName = 'DataCell';

export default DataCell;
