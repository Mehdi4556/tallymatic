import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { sortBy } from 'lodash';
import { keepPreviousData } from '@tanstack/react-query';
import { flexRender } from '@tanstack/react-table';

import { useDataTable } from '@/components/common/table/table-data';
import { ToggleColumns } from '@/components/common/table/toggle-columns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useProducts } from '@/hooks/api/products';

import { useProductTableColumns } from '../hooks/use-product-table-columns';
import { useProductTableQuery } from '../hooks/use-product-table-query';
import { ProductListSkeleton } from './product-list-skeleton';

export const ProductListTable = () => {
  const offsetKey = 'offset';
  const columns = useProductTableColumns();
  const [globalFilter, setGlobalFilter] = useState('');
  // const [searchParams, setSearchParams] = useSearchParams();
  const { searchParams } = useProductTableQuery({});

  console.log('searchParams', searchParams);

  // TODO: fix offset, limit, and sorting
  const {
    results = [],
    isLoading,
    isError,
    error,
    count,
  } = useProducts(
    {
      ...searchParams,
      // name: searchParams.has('name') ? searchParams.get('name') : undefined,
    },
    {
      placeholderData: keepPreviousData,
    }
  );

  const onGlobalFilterChange = (value: string) => {
    // setSearchParams((prev) => {
    //   if (!value) {
    //     prev.delete('name');
    //     return prev;
    //   }

    //   const newSearch = new URLSearchParams(prev);
    //   newSearch.set('name', value);
    //   newSearch.delete(offsetKey);

    //   return newSearch;
    // });

    setGlobalFilter(value);
  };

  const table = useDataTable({
    columns,
    data: results,
    rowCount: count,
    enableSorting: true,
    enableFiltering: true,
    enablePagination: true,
    enableRowSelection: true,
  });

  if (isError) {
    throw error;
  }

  if (isLoading) {
    return <ProductListSkeleton />;
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 py-4">
        <Input
          placeholder="Filter products..."
          value={globalFilter ?? ''}
          onChange={(e) => onGlobalFilterChange(String(e.target.value))}
          className="max-w-sm"
        />

        <ToggleColumns table={table} />
      </div>
      <Table dense bleed className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHeader key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHeader>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
