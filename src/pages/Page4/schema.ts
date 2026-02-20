import { z } from 'zod';

const ColumnSchema = z.object({
  id: z.string(),
  from: z.number(),
  to: z.number(),
});

const CellSchema = z.object({
  columnId: z.string(),
  value: z.number(),
});

const RowSchema = z.object({
  rowId: z.string().optional(),
  rowName: z.string().min(1, 'Tên hàng không được để trống'),
  cells: z.array(CellSchema),
});

export const MatrixSchema = z.object({
  columns: z.array(ColumnSchema),
  rows: z.array(RowSchema),
});

export type MatrixData = z.infer<typeof MatrixSchema>;
