import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '@/hooks/queries/useAuth';
import { useGetCallerOrderHistory } from '@/hooks/queries/useOrders';
import Seo from '@/components/seo/Seo';
import LoadingSpinner from '@/components/LoadingSpinner';
import OrderHistory from '@/components/storefront/OrderHistory';
import { User, Package, Loader2 } from 'lucide-react';

export default function AccountPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: orders = [], isLoading: ordersLoading } = useGetCallerOrderHistory();
  const saveMutation = useSaveCallerUserProfile();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setMobile(userProfile.mobile || '');
      setAddress(userProfile.address || '');
    }
  }, [userProfile]);

  const handleSave = async () => {
    await saveMutation.mutateAsync({
      name: name.trim(),
      mobile: mobile.trim() || undefined,
      address: address.trim() || undefined,
    });
  };

  if (!identity) {
    return (
      <>
        <Seo title="Account" description="Manage your account and view order history" />
        <div className="container-custom section-padding">
          <Card className="max-w-md mx-auto text-center py-12">
            <CardContent className="space-y-6">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto">
                <User className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Sign in to your account</h2>
                <p className="text-muted-foreground">
                  View your profile and order history
                </p>
              </div>
              <Button
                size="lg"
                onClick={login}
                disabled={loginStatus === 'logging-in'}
              >
                {loginStatus === 'logging-in' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (profileLoading || !isFetched) {
    return (
      <>
        <Seo title="Account" description="Manage your account and view order history" />
        <div className="container-custom section-padding">
          <LoadingSpinner />
        </div>
      </>
    );
  }

  return (
    <>
      <Seo title="Account" description="Manage your account and view order history" />
      <div className="container-custom section-padding">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">My Account</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Your delivery address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button
                  onClick={handleSave}
                  disabled={!name.trim() || saveMutation.isPending}
                  className="w-full"
                >
                  {saveMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <LoadingSpinner />
                ) : (
                  <OrderHistory orders={orders} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
