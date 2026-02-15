import { lazy, Suspense } from 'react';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import StorefrontLayout from './components/site/StorefrontLayout';
import LoadingSpinner from './components/LoadingSpinner';

// Eager-load critical routes
import HomePage from './pages/storefront/HomePage';
import MenuPage from './pages/storefront/MenuPage';
import CartPage from './pages/storefront/CartPage';

// Lazy-load non-critical routes
const CheckoutPage = lazy(() => import('./pages/storefront/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('./pages/storefront/OrderConfirmationPage'));
const ContactPage = lazy(() => import('./pages/storefront/ContactPage'));
const AccountPage = lazy(() => import('./pages/storefront/AccountPage'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminCategoriesPage = lazy(() => import('./pages/admin/AdminCategoriesPage'));
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage'));
const AdminPromoCodesPage = lazy(() => import('./pages/admin/AdminPromoCodesPage'));
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage'));
const AdminCustomersPage = lazy(() => import('./pages/admin/AdminCustomersPage'));

// Root route with layout
const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Outlet />
      <Toaster />
    </ThemeProvider>
  ),
});

// Storefront routes
const storefrontRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'storefront',
  component: () => (
    <StorefrontLayout>
      <Outlet />
    </StorefrontLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: '/',
  component: HomePage,
});

const menuRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: '/menu',
  component: MenuPage,
});

const cartRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: '/cart',
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: '/checkout',
  component: () => (
    <Suspense fallback={<LoadingSpinner />}>
      <CheckoutPage />
    </Suspense>
  ),
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: '/order-confirmation/$orderId',
  component: () => (
    <Suspense fallback={<LoadingSpinner />}>
      <OrderConfirmationPage />
    </Suspense>
  ),
});

const contactRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: '/contact',
  component: () => (
    <Suspense fallback={<LoadingSpinner />}>
      <ContactPage />
    </Suspense>
  ),
});

const accountRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: '/account',
  component: () => (
    <Suspense fallback={<LoadingSpinner />}>
      <AccountPage />
    </Suspense>
  ),
});

// Admin routes
const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <Suspense fallback={<LoadingSpinner />}>
      <AdminLoginPage />
    </Suspense>
  ),
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/dashboard',
  component: () => (
    <Suspense fallback={<LoadingSpinner />}>
      <AdminDashboardPage />
    </Suspense>
  ),
});

const adminCategoriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/categories',
  component: () => (
    <Suspense fallback={<LoadingSpinner />}>
      <AdminCategoriesPage />
    </Suspense>
  ),
});

const adminProductsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/products',
  component: () => (
    <Suspense fallback={<LoadingSpinner />}>
      <AdminProductsPage />
    </Suspense>
  ),
});

const adminPromoCodesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/promo-codes',
  component: () => (
    <Suspense fallback={<LoadingSpinner />}>
      <AdminPromoCodesPage />
    </Suspense>
  ),
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/orders',
  component: () => (
    <Suspense fallback={<LoadingSpinner />}>
      <AdminOrdersPage />
    </Suspense>
  ),
});

const adminCustomersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/customers',
  component: () => (
    <Suspense fallback={<LoadingSpinner />}>
      <AdminCustomersPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  storefrontRoute.addChildren([
    indexRoute,
    menuRoute,
    cartRoute,
    checkoutRoute,
    orderConfirmationRoute,
    contactRoute,
    accountRoute,
  ]),
  adminLoginRoute,
  adminDashboardRoute,
  adminCategoriesRoute,
  adminProductsRoute,
  adminPromoCodesRoute,
  adminOrdersRoute,
  adminCustomersRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
