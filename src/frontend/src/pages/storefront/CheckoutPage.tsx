import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/state/useCart';
import { usePlaceOrder } from '@/hooks/mutations/usePlaceOrder';
import Seo from '@/components/seo/Seo';
import PromoCodeBox from '@/components/storefront/PromoCodeBox';
import { ShoppingBag, Loader2 } from 'lucide-react';
import type { PromoCode, OrderProduct } from '@/backend';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCart();
  const placeOrderMutation = usePlaceOrder();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = getTotal();
  const discount = appliedPromo 
    ? appliedPromo.discountType.__kind__ === 'flat'
      ? appliedPromo.discountType.flat
      : (subtotal * appliedPromo.discountType.percentage) / 100
    : 0;
  const total = subtotal - discount;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(mobile.trim())) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const orderProducts: OrderProduct[] = items.map(item => ({
      productId: item.product.id,
      quantity: BigInt(item.quantity),
    }));

    try {
      const orderId = await placeOrderMutation.mutateAsync({
        name: name.trim(),
        mobile: mobile.trim(),
        address: address.trim(),
        products: orderProducts,
        totalAmount: total,
        promoCodeId: appliedPromo?.id || null,
      });

      clearCart();
      navigate({ to: `/order-confirmation/${orderId}` });
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Seo title="Checkout" description="Complete your order" />
        <div className="container-custom section-padding">
          <Card className="max-w-md mx-auto text-center py-12">
            <CardContent className="space-y-6">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Your cart is empty</h2>
                <p className="text-muted-foreground">
                  Add items to your cart before checking out
                </p>
              </div>
              <Button size="lg" onClick={() => navigate({ to: '/menu' })}>
                Browse Menu
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo title="Checkout" description="Complete your order and enter delivery details" />
      <div className="container-custom section-padding">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Customer Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && (
                      <p id="name-error" className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number *</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                      maxLength={10}
                      aria-invalid={!!errors.mobile}
                      aria-describedby={errors.mobile ? 'mobile-error' : undefined}
                    />
                    {errors.mobile && (
                      <p id="mobile-error" className="text-sm text-destructive">{errors.mobile}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your complete delivery address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={4}
                      aria-invalid={!!errors.address}
                      aria-describedby={errors.address ? 'address-error' : undefined}
                    />
                    {errors.address && (
                      <p id="address-error" className="text-sm text-destructive">{errors.address}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {items.map((item) => (
                    <div key={item.product.id.toString()} className="flex justify-between text-sm">
                      <span>
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <PromoCodeBox 
                    orderAmount={subtotal}
                    onPromoApplied={setAppliedPromo}
                  />

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-primary">
                        <span>Discount</span>
                        <span className="font-medium">-₹{discount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toFixed(2)}</span>
                  </div>

                  <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <p className="font-medium mb-1">Payment Method</p>
                    <p>Cash on Delivery (Online payments coming soon)</p>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={placeOrderMutation.isPending}
                  >
                    {placeOrderMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
