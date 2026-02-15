import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, Calendar } from 'lucide-react';
import type { Order, Product, ProductVariant } from '@/backend';
import { useGetAllProducts } from '@/hooks/queries/useProducts';
import { useGetVariantsByProduct } from '@/hooks/queries/useVariants';

interface OrderHistoryProps {
  orders: Order[];
}

function OrderItemWithVariant({ 
  productId, 
  variantId, 
  quantity, 
  price 
}: { 
  productId: bigint; 
  variantId: bigint; 
  quantity: bigint; 
  price: number;
}) {
  const { data: products } = useGetAllProducts();
  const product = products?.find((p) => p.id === productId);
  const { data: variants } = useGetVariantsByProduct(variantId !== BigInt(0) ? productId : null);
  const variant = variants?.find((v) => v.id === variantId);

  return (
    <div className="flex justify-between items-start text-sm">
      <div className="flex-1">
        <span className="font-medium">{product?.name || 'Unknown Product'}</span>
        {variant && <span className="text-muted-foreground ml-2">({variant.name})</span>}
        <span className="text-muted-foreground ml-2">× {quantity.toString()}</span>
      </div>
      <span className="font-medium">₹{(price * Number(quantity)).toFixed(2)}</span>
    </div>
  );
}

export default function OrderHistory({ orders }: OrderHistoryProps) {
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">You haven't placed any orders yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id.toString()}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-sm">#{order.id.toString()}</span>
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
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(Number(order.orderDate) / 1000000).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">
                  ₹{(order.discountedAmount ?? order.totalAmount).toFixed(2)}
                </div>
                {order.discountedAmount && (
                  <div className="text-xs text-muted-foreground line-through">
                    ₹{order.totalAmount.toFixed(2)}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              {order.products.map((item, index) => (
                <OrderItemWithVariant
                  key={index}
                  productId={item.productId}
                  variantId={item.variantId}
                  quantity={item.quantity}
                  price={item.price}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
