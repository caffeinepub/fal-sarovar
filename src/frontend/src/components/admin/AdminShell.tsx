import { ReactNode } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { 
  LayoutDashboard, 
  FolderTree, 
  Package, 
  Tag, 
  ShoppingBag, 
  Users, 
  LogOut 
} from 'lucide-react';
import AdminRouteGuard from '@/components/auth/AdminRouteGuard';

interface AdminShellProps {
  children: ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clear } = useInternetIdentity();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/admin' });
  };

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/categories', label: 'Categories', icon: FolderTree },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/promo-codes', label: 'Promo Codes', icon: Tag },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { to: '/admin/customers', label: 'Customers', icon: Users },
  ];

  return (
    <AdminRouteGuard>
      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background">
          <div className="container-custom">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src="/assets/generated/fal-sarovar-logo.dim_512x512.png" 
                  alt="Fal Sarovar" 
                  className="h-8 w-8 object-contain"
                />
                <span className="text-lg font-bold">Admin Panel</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="container-custom py-6">
          <div className="grid lg:grid-cols-[240px_1fr] gap-6">
            {/* Sidebar */}
            <aside className="space-y-2">
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent"
                    activeProps={{ className: 'bg-primary text-primary-foreground hover:bg-primary' }}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </aside>

            {/* Main Content */}
            <main>{children}</main>
          </div>
        </div>
      </div>
    </AdminRouteGuard>
  );
}
