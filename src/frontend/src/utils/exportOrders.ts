import type { Order, Product } from '@/backend';

export function exportOrdersToCSV(orders: Order[], products: Product[]) {
  const productMap = new Map(products.map((p) => [p.id.toString(), p]));

  const rows = [
    [
      'Order ID',
      'Date',
      'Customer ID',
      'Product Name',
      'Variant ID',
      'Quantity',
      'Unit Price',
      'Subtotal',
      'Total Amount',
      'Discount',
      'Final Amount',
      'Status',
      'Payment Method',
      'Payment Status',
    ],
  ];

  orders.forEach((order) => {
    order.products.forEach((item, index) => {
      const product = productMap.get(item.productId.toString());
      const isFirstItem = index === 0;

      rows.push([
        isFirstItem ? order.id.toString() : '',
        isFirstItem ? new Date(Number(order.orderDate) / 1000000).toLocaleString() : '',
        isFirstItem ? order.customerId.toString() : '',
        product?.name || 'Unknown',
        item.variantId.toString(),
        item.quantity.toString(),
        item.price.toFixed(2),
        (item.price * Number(item.quantity)).toFixed(2),
        isFirstItem ? order.totalAmount.toFixed(2) : '',
        isFirstItem ? (order.discountedAmount ? (order.totalAmount - order.discountedAmount).toFixed(2) : '0.00') : '',
        isFirstItem ? (order.discountedAmount ?? order.totalAmount).toFixed(2) : '',
        isFirstItem ? order.status : '',
        isFirstItem ? (order.paymentMethod || 'Cash on Delivery') : '',
        isFirstItem ? (order.paymentStatus || 'Pending') : '',
      ]);
    });
  });

  const csvContent = rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
