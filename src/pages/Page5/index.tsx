import TanstackVirtualizedTable from '@/components/TanstackVirtualizedTable';
import { useMemo } from 'react';
import makeData from './makeData';
import type { ColumnDef } from '@tanstack/react-table';

interface User {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
}

export default function Page5() {
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: 'index',
        header: 'Row Index',
        size: 80,
        accessorFn: (_row, index) => index + 1,
        meta: { sticky: 'left' },
      },
      {
        header: 'Name',
        columns: [
          {
            accessorKey: 'firstName',
            header: 'First Name',
          },
          {
            accessorKey: 'lastName',
            header: 'Last Name',
          },
        ],
      },
      {
        header: 'Info',
        columns: [
          {
            accessorKey: 'age',
            header: 'Age',
            size: 50,
          },
          {
            accessorKey: 'visits',
            header: 'Visits',
            size: 60,
          },
          {
            accessorKey: 'status',
            header: 'Status',
          },
          {
            accessorKey: 'progress',
            header: 'Profile Progress',
            meta: { sticky: 'right' },
          },
        ],
      },
    ],
    [],
  );

  const data = useMemo(() => makeData(100000), []);

  return (
    <>
      <div>
        <h1>Page 5</h1>
      </div>
      <TanstackVirtualizedTable columns={columns} data={data} />
    </>
  );
}
