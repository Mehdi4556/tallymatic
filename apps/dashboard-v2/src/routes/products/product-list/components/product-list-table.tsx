import { useEffect, useState } from 'react';

import { Avatar } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getOrders } from '@/data';

export const ProductListTable = () => {
  const [orders, setOrders] = useState<Awaited<ReturnType<typeof getOrders>>>([]);

  useEffect(() => {
    (async () => {
      setOrders(await getOrders());
    })();
  }, []);

  return (
    <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
      <TableHead>
        <TableRow>
          <TableHeader>Order number</TableHeader>
          <TableHeader>Purchase date</TableHeader>
          <TableHeader>Customer</TableHeader>
          <TableHeader>Event</TableHeader>
          <TableHeader className="text-right">Amount</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id} href={order.url} title={`Order #${order.id}`}>
            <TableCell>{order.id}</TableCell>
            <TableCell className="text-zinc-500">{order.date}</TableCell>
            <TableCell>{order.customer.name}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar src={order.event.thumbUrl} className="size-6" />
                <span>{order.event.name}</span>
              </div>
            </TableCell>
            <TableCell className="text-right">US{order.amount.usd}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};