import { useState, useEffect } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '@/hooks/queries/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogIn, User, Save } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import Seo from '@/components/seo/Seo';

export default function AccountPage() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveMutation = useSaveCallerUserProfile();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  // Update form when profile loads
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setMobile(userProfile.mobile || '');
      setAddress(userProfile.address || '');
    } else if (isFetched && !userProfile) {
      // Profile doesn't exist yet, keep form empty
      setName('');
      setMobile('');
      setAddress('');
    }
  }, [userProfile, isFetched]);

  // Reset form when logged out
  useEffect(() => {
    if (!isAuthenticated) {
      setName('');
      setMobile('');
      setAddress('');
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }

    saveMutation.mutate({
      name: name.trim(),
      mobile: mobile.trim() || undefined,
      address: address.trim() || undefined,
    });
  };

  if (!isAuthenticated) {
    return (
      <>
        <Seo title="Account - Fal Sarovar" description="Login to manage your account" />
        <div className="container-custom py-12">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Account</CardTitle>
                <CardDescription>
                  Please log in to view and manage your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleLogin} 
                  disabled={isLoggingIn}
                  className="w-full"
                  size="lg"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  {isLoggingIn ? 'Logging in...' : 'Login with Internet Identity'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  if (profileLoading) {
    return (
      <>
        <Seo title="Account - Fal Sarovar" description="Manage your account" />
        <LoadingSpinner />
      </>
    );
  }

  return (
    <>
      <Seo title="Account - Fal Sarovar" description="Manage your account" />
      <div className="container-custom py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Account</h1>
            <p className="text-muted-foreground">
              Manage your profile information
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal details below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter your mobile number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your address"
                    rows={4}
                  />
                </div>

                {!userProfile && (
                  <Alert>
                    <AlertDescription>
                      This is your first time setting up your profile. Please provide at least your name.
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  disabled={saveMutation.isPending || !name.trim()}
                  className="w-full"
                  size="lg"
                >
                  <Save className="mr-2 h-5 w-5" />
                  {saveMutation.isPending ? 'Saving...' : 'Save Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
