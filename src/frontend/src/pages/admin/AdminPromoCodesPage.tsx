import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useGetAllPromoCodes, useCreatePromoCode, useUpdatePromoCode, useDeletePromoCode } from '@/hooks/queries/usePromoCodes';
import AdminShell from '@/components/admin/AdminShell';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { PromoCode } from '@/backend';

export default function AdminPromoCodesPage() {
  const { data: promoCodes, isLoading } = useGetAllPromoCodes();
  const createMutation = useCreatePromoCode();
  const updateMutation = useUpdatePromoCode();
  const deleteMutation = useDeletePromoCode();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [deletingPromo, setDeletingPromo] = useState<PromoCode | null>(null);

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'flat' | 'percentage'>('flat');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrderValue, setMinOrderValue] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isActive, setIsActive] = useState(true);

  const handleOpenDialog = (promo?: PromoCode) => {
    if (promo) {
      setEditingPromo(promo);
      setCode(promo.code);
      setDiscountType(promo.discountType.__kind__ as 'flat' | 'percentage');
      setDiscountValue(
        promo.discountType.__kind__ === 'flat'
          ? promo.discountType.flat.toString()
          : promo.discountType.percentage.toString()
      );
      setMinOrderValue(promo.minOrderValue.toString());
      setExpiryDate(promo.expiryDate ? new Date(Number(promo.expiryDate) / 1000000).toISOString().split('T')[0] : '');
      setIsActive(promo.isActive);
    } else {
      setEditingPromo(null);
      setCode('');
      setDiscountType('flat');
      setDiscountValue('');
      setMinOrderValue('0');
      setExpiryDate('');
      setIsActive(true);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPromo(null);
    setCode('');
    setDiscountType('flat');
    setDiscountValue('');
    setMinOrderValue('0');
    setExpiryDate('');
    setIsActive(true);
  };

  const handleSubmit = async () => {
    if (!code.trim() || !discountValue) return;

    const promoData = {
      code: code.trim().toUpperCase(),
      discountType:
        discountType === 'flat'
          ? { __kind__: 'flat' as const, flat: parseFloat(discountValue) }
          : { __kind__: 'percentage' as const, percentage: parseFloat(discountValue) },
      minOrderValue: parseFloat(minOrderValue) || 0,
      expiryDate: expiryDate ? BigInt(new Date(expiryDate).getTime() * 1000000) : null,
      isActive,
    };

    if (editingPromo) {
      await updateMutation.mutateAsync({
        id: editingPromo.id,
        ...promoData,
      });
    } else {
      await createMutation.mutateAsync(promoData);
    }

    handleCloseDialog();
  };

  const handleDelete = async () => {
    if (!deletingPromo) return;
    await deleteMutation.mutateAsync(deletingPromo.id);
    setDeleteDialogOpen(false);
    setDeletingPromo(null);
  };

  if (isLoading) {
    return (
      <AdminShell>
        <LoadingSpinner />
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Promo Codes</h1>
            <p className="text-muted-foreground mt-1">Manage discount codes for customers</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Promo Code
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Promo Codes</CardTitle>
          </CardHeader>
          <CardContent>
            {promoCodes && promoCodes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Min Order</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promoCodes.map((promo) => (
                    <TableRow key={promo.id.toString()}>
                      <TableCell className="font-mono font-bold">{promo.code}</TableCell>
                      <TableCell>
                        {promo.discountType.__kind__ === 'flat'
                          ? `₹${promo.discountType.flat.toFixed(2)}`
                          : `${promo.discountType.percentage}%`}
                      </TableCell>
                      <TableCell>₹{promo.minOrderValue.toFixed(2)}</TableCell>
                      <TableCell>
                        {promo.expiryDate
                          ? new Date(Number(promo.expiryDate) / 1000000).toLocaleDateString()
                          : 'No expiry'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={promo.isActive ? 'default' : 'secondary'}>
                          {promo.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(promo)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setDeletingPromo(promo);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No promo codes yet. Create your first one!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPromo ? 'Edit Promo Code' : 'Create Promo Code'}</DialogTitle>
            <DialogDescription>
              {editingPromo ? 'Update the promo code details below' : 'Add a new discount code for customers'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                placeholder="e.g., SAVE20"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type *</Label>
                <Select value={discountType} onValueChange={(v) => setDiscountType(v as 'flat' | 'percentage')}>
                  <SelectTrigger id="discountType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flat">Flat Amount (₹)</SelectItem>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountValue">Value *</Label>
                <Input
                  id="discountValue"
                  type="number"
                  step="0.01"
                  placeholder={discountType === 'flat' ? '50.00' : '10'}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="minOrderValue">Minimum Order Value (₹)</Label>
              <Input
                id="minOrderValue"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
              <Input
                id="expiryDate"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!code.trim() || !discountValue || createMutation.isPending || updateMutation.isPending}
            >
              {editingPromo ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Promo Code?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingPromo?.code}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
}
