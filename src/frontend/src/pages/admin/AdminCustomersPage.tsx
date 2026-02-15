import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useGetAllOrders } from '@/hooks/queries/useOrders';
import AdminShell from '@/components/admin/AdminShell';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { Customer, Order } from '@/backend';

export default function AdminCustomersPage() {
  const { data: orders, isLoading } = useGetAllOrders();

  // Derive unique customers from orders
  const customersMap = new Map<string, { customer: Customer; orders: Order[] }>();

  orders?.forEach((order) => {
    const customerId = order.customerId.toString();
    if (!customersMap.has(customerId)) {
      customersMap.set(customerId, {
        customer: {
          id: order.customerId,
          name: '', // Will be populated from first order
          mobile: '',
          address: '',
        },
        orders: [],
      });
    }
    customersMap.get(customerId)!.orders.push(order);
  });

  const customers = Array.from(customersMap.values());

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
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground mt-1">View customer information and order history</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Customers ({customers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {customers.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {customers.map(({ customer, orders: customerOrders }) => (
                  <AccordionItem key={customer.id.toString()} value={customer.id.toString()}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="text-left">
                          <p className="font-semibold">Customer #{customer.id.toString()}</p>
                          <p className="text-sm text-muted-foreground">
                            {customerOrders.length} order{customerOrders.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-4">
                        <div className="text-sm space-y-2">
                          <p>
                            <span className="font-medium">Total Orders:</span> {customerOrders.length}
                          </p>
                          <p>
                            <span className="font-medium">Total Spent:</span> ₹
                            {customerOrders
                              .reduce((sum, o) => sum + (o.discountedAmount ?? o.totalAmount), 0)
                              .toFixed(2)}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Order History</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {customerOrders.map((order) => (
                                <TableRow key={order.id.toString()}>
                                  <TableCell className="font-mono">#{order.id.toString()}</TableCell>
                                  <TableCell>
                                    {new Date(Number(order.orderDate) / 1000000).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell>{order.products.length}</TableCell>
                                  <TableCell>
                                    ₹{(order.discountedAmount ?? order.totalAmount).toFixed(2)}
                                  </TableCell>
                                  <TableCell className="capitalize">{order.status}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No customers yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
