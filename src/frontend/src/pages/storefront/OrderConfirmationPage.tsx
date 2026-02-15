import { useParams, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Home, Menu } from 'lucide-react';
import Seo from '@/components/seo/Seo';

export default function OrderConfirmationPage() {
  const { orderId } = useParams({ from: '/storefront/order-confirmation/$orderId' });

  return (
    <>
      <Seo title="Order Confirmed" description="Your order has been placed successfully" />
      <div className="container-custom section-padding">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl">Order Confirmed!</CardTitle>
              <p className="text-muted-foreground">
                Thank you for your order. We'll prepare it with care.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-6 rounded-lg text-center space-y-2">
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="text-2xl font-bold font-mono">#{orderId}</p>
            </div>

            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                We've received your order and will start preparing it shortly. 
                You'll receive your fresh, healthy meal soon!
              </p>
              <p className="text-muted-foreground">
                For any questions about your order, please contact us with your order ID.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link to="/" className="flex-1">
                <Button variant="outline" size="lg" className="w-full gap-2">
                  <Home className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <Link to="/menu" className="flex-1">
                <Button size="lg" className="w-full gap-2">
                  <Menu className="h-4 w-4" />
                  Browse Menu
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
