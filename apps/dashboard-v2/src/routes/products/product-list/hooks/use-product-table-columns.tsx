import { ArrowUpDown } from 'lucide-react';
import { ProductResponse } from '@shared';
import { createColumnHelper } from '@tanstack/react-table';

import { Checkbox } from '@/components/ui/checkbox';

import { ProductActions } from './use-product-table-actions';

const columnHelper = createColumnHelper<ProductResponse>();

export const useProductTableColumns = () => {
  return [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          className="w-6 h-6"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="w-6"
          checked={row.getIsSelected()}
          onChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }),
    columnHelper.accessor('name', {
      header: ({ column }) => {
        return (
          <button
            className="flex items-center space-x-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
      enableHiding: false,
    }),
    columnHelper.accessor('price', {
      header: ({ column }) => {
        return (
          <button className="table-cell w-full" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            <div className="flex items-center justify-end space-x-2">
              Price
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
          </button>
        );
      },
      cell: ({ row }) => {
        const price = parseFloat(row.getValue('price'));
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(price);
        return <div className="text-right font-medium">{formatted}</div>;
      },
    }),
    columnHelper.display({
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original;
        return <ProductActions product={product} />;
      },
    }),
  ];
};
