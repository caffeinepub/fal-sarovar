import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetAllOrders, useUpdateOrderStatus, useMarkOrderAsSeen } from '@/hooks/queries/useOrders';
import { useGetAllProducts } from '@/hooks/queries/useProducts';
import { OrderStatus } from '@/backend';
import AdminShell from '@/components/admin/AdminShell';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Download } from 'lucide-react';
import { exportOrdersToCSV } from '@/utils/exportOrders';

export default function AdminOrdersPage() {
  const { data: orders, isLoading } = useGetAllOrders();
  const { data: products } = useGetAllProducts();
  const updateStatusMutation = useUpdateOrderStatus();
  const markSeenMutation = useMarkOrderAsSeen();

  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders =
    statusFilter === 'all' ? orders : orders?.filter((o) => o.status === statusFilter);

  const handleStatusChange = async (orderId: bigint, status: OrderStatus) => {
    await updateStatusMutation.mutateAsync({ orderId, status });
    await markSeenMutation.mutateAsync(orderId);
  };

  const handleMarkAsSeen = async (orderId: bigint) => {
    await markSeenMutation.mutateAsync(orderId);
  };

  const handleExport = () => {
    if (!filteredOrders || !products) return;
    exportOrdersToCSV(filteredOrders, products);
  };

  if (isLoading) {
    return (
      <AdminShell>
        <LoadingSpinner />
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground mt-1">Manage customer orders</p>
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExport} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {statusFilter === 'all' ? 'All Orders' : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Orders`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredOrders && filteredOrders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow
                      key={order.id.toString()}
                      className={order.isNew ? 'bg-primary/5' : ''}
                      onClick={() => order.isNew && handleMarkAsSeen(order.id)}
                    >
                      <TableCell className="font-mono font-medium">
                        #{order.id.toString()}
                        {order.isNew && (
                          <Badge variant="destructive" className="ml-2 text-xs">
                            New
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(Number(order.orderDate) / 1000000).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{order.products.length} items</TableCell>
                      <TableCell className="font-semibold">
                        ₹{(order.discountedAmount ?? order.totalAmount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === 'completed'
                              ? 'default'
                              : order.status === 'accepted'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No orders found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
