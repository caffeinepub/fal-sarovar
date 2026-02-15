import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/state/useCart';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Seo from '@/components/seo/Seo';
import PromoCodeBox from '@/components/storefront/PromoCodeBox';
import { useState } from 'react';
import type { PromoCode } from '@/backend';
import { getBlobPreviewUrl } from '@/utils/blob';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal } = useCart();
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  const subtotal = getTotal();
  const discount = appliedPromo 
    ? appliedPromo.discountType.__kind__ === 'flat'
      ? appliedPromo.discountType.flat
      : (subtotal * appliedPromo.discountType.percentage) / 100
    : 0;
  const total = subtotal - discount;

  if (items.length === 0) {
    return (
      <>
        <Seo title="Cart" description="Your shopping cart is empty" />
        <div className="container-custom section-padding">
          <Card className="max-w-md mx-auto text-center py-12">
            <CardContent className="space-y-6">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Your cart is empty</h2>
                <p className="text-muted-foreground">
                  Add some delicious healthy items to get started
                </p>
              </div>
              <Link to="/menu">
                <Button size="lg" className="gap-2">
                  Browse Menu <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo title="Cart" description="Review your cart and proceed to checkout" />
      <div className="container-custom section-padding">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={`${item.product.id.toString()}-${item.variantId?.toString() || 'none'}`}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.images.length > 0 && (
                        <img 
                          src={getBlobPreviewUrl(item.product.images[0])} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1">
                        {item.product.name}
                        {item.variantName && (
                          <span className="text-sm text-muted-foreground ml-2">({item.variantName})</span>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {item.product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          ₹{item.unitPrice.toFixed(2)}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 border rounded-lg">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variantId || undefined)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variantId || undefined)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => removeItem(item.product.id, item.variantId || undefined)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

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

                <Link to="/checkout">
                  <Button size="lg" className="w-full gap-2">
                    Proceed to Checkout <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <Link to="/menu">
                  <Button variant="outline" size="lg" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
