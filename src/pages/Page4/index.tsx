import { useFieldArray, useForm, FormProvider } from 'react-hook-form';
import { MatrixSchema, type MatrixData } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { nanoid } from 'nanoid';
import { useMemo } from 'react';
import { VirtualizedTable, type VirtualColumn } from '../../components/VirtualizedTable';
import DataCell from './DataCell';
import DataHeaderCell from './DataHeaderCell';
import { Button } from 'antd';

const Page4 = () => {
  // Memoize defaultValues để tránh tạo nanoid mới mỗi lần render
  const defaultValues = useMemo(() => {
    const colId = nanoid();
    const cellColId = nanoid();
    return {
      columns: [{ id: colId, from: 0, to: 10 }],
      rows: [{ rowId: nanoid(), rowName: 'Nhóm A', cells: [{ columnId: cellColId, value: 0 }] }],
    };
  }, []);

  const form = useForm<MatrixData>({
    resolver: zodResolver(MatrixSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
  } = form;

  const { append: appendColumn } = useFieldArray({
    control,
    name: 'columns',
  });

  const { append: appendRow } = useFieldArray({
    control,
    name: 'rows',
  });

  // Watch columns từ useFieldArray fields
  const columns = watch('columns');

  // Hàm thêm cột thông minh
  const handleAddColumn = () => {
    const newColId = nanoid();

    // Thêm cột mới bằng useFieldArray
    appendColumn({ id: newColId, from: 0, to: 0 });
  };

  // Tạo virtual columns từ dữ liệu - memo để tránh re-tạo khi rows thay đổi
  // Filter out null/undefined columns
  const validColumns = useMemo(() => columns.filter((col) => col && col.id), [columns]);

  const virtualColumns = useMemo(
    () => [
      {
        title: 'Tên hàng',
        dataIndex: 'rowName',
        key: 'rowName',
        width: 150,
        fixed: 'left',
      } as VirtualColumn,
      ...validColumns.map((col, colIndex) => {
        // Tìm realIndex của column trong full columns array
        const realIndex = columns.findIndex((c) => c && c.id === col.id);
        return {
          title: `${col.from}-${col.to}`,
          dataIndex: col.id,
          key: col.id,
          width: 200,
          render: (_value: any, _record: any, rowIndex: number) => (
            <DataCell rowIndex={rowIndex} cellIndex={colIndex} />
          ),
          // Header sẽ là input fields cho from và to
          headerRender: () => (
            <div className="flex gap-1 w-full">
              <DataHeaderCell columnIndex={realIndex} field="from" />
              <span>-</span>
              <DataHeaderCell columnIndex={realIndex} field="to" />
            </div>
          ),
        } as VirtualColumn;
      }),
    ],
    [validColumns, columns],
  );

  const onSubmit = (data: MatrixData) => {
    console.log('Form submitted successfully:', data);
  };

  const onError = (fieldErrors: any) => {
    console.error('Form validation errors:', fieldErrors);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={handleAddColumn}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            + Thêm cột
          </button>
          <button
            type="button"
            onClick={() =>
              appendRow({
                rowId: nanoid(),
                rowName: 'Nhóm mới',
                cells: validColumns.map((col) => ({ columnId: col.id, value: 0 })),
              })
            }
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            + Thêm hàng
          </button>
        </div>

        <VirtualizedTable
          columns={virtualColumns}
          dataSource={getValues('rows')}
          width={1000}
          height={400}
          rowHeight={40}
          headerHeight={45}
        />

        {Object.keys(errors).length > 0 && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            <strong>Lỗi validation:</strong>
            <pre className="mt-2">{JSON.stringify(errors, null, 2)}</pre>
          </div>
        )}

        <Button type="primary" htmlType="submit" className="mt-4">
          Gửi
        </Button>
      </form>
    </FormProvider>
  );
};

export default Page4;
