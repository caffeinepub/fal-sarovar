import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { useGetAllOrders, useGetNewOrderCount } from '@/hooks/queries/useOrders';
import { useGetAllProducts } from '@/hooks/queries/useProducts';
import { useGetAllCategories } from '@/hooks/queries/useCategories';
import AdminShell from '@/components/admin/AdminShell';
import { ShoppingBag, Package, FolderTree, TrendingUp, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboardPage() {
  const { data: orders } = useGetAllOrders();
  const { data: newOrderCount } = useGetNewOrderCount();
  const { data: products } = useGetAllProducts();
  const { data: categories } = useGetAllCategories();

  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;
  const totalRevenue = orders?.reduce((sum, order) => {
    const amount = order.discountedAmount ?? order.totalAmount;
    return sum + amount;
  }, 0) || 0;

  const stats = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: ShoppingBag,
      link: '/admin/orders',
    },
    {
      title: 'New Orders',
      value: Number(newOrderCount || BigInt(0)),
      icon: AlertCircle,
      link: '/admin/orders',
      badge: Number(newOrderCount || BigInt(0)) > 0,
    },
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toFixed(2)}`,
      icon: TrendingUp,
    },
    {
      title: 'Products',
      value: products?.length || 0,
      icon: Package,
      link: '/admin/products',
    },
    {
      title: 'Categories',
      value: categories?.length || 0,
      icon: FolderTree,
      link: '/admin/categories',
    },
  ];

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to your admin panel. Manage your store from here.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold flex items-center gap-2">
                    {stat.value}
                    {stat.badge && (
                      <Badge variant="destructive" className="text-xs">New</Badge>
                    )}
                  </div>
                  {stat.link && (
                    <Link to={stat.link}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Link to="/admin/products">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Package className="h-4 w-4" />
                Add New Product
              </Button>
            </Link>
            <Link to="/admin/categories">
              <Button variant="outline" className="w-full justify-start gap-2">
                <FolderTree className="h-4 w-4" />
                Manage Categories
              </Button>
            </Link>
            <Link to="/admin/orders">
              <Button variant="outline" className="w-full justify-start gap-2">
                <ShoppingBag className="h-4 w-4" />
                View Orders
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        {pendingOrders > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Pending Orders
                <Badge variant="destructive">{pendingOrders}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                You have {pendingOrders} pending order{pendingOrders !== 1 ? 's' : ''} waiting for your attention.
              </p>
              <Link to="/admin/orders">
                <Button>View Pending Orders</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminShell>
  );
}
