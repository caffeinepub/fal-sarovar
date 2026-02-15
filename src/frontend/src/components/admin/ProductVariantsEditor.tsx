import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import type { ProductVariant } from '@/backend';
import {
  useGetVariantsByProduct,
  useCreateVariant,
  useUpdateVariant,
  useDeleteVariant,
} from '@/hooks/queries/useVariants';

interface ProductVariantsEditorProps {
  productId: bigint | null;
}

export default function ProductVariantsEditor({ productId }: ProductVariantsEditorProps) {
  const { data: variants = [] } = useGetVariantsByProduct(productId);
  const createMutation = useCreateVariant();
  const updateMutation = useUpdateVariant();
  const deleteMutation = useDeleteVariant();

  const [editing, setEditing] = useState<ProductVariant | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [inStock, setInStock] = useState(true);

  const resetForm = () => {
    setName('');
    setPrice('');
    setIsActive(true);
    setInStock(true);
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (variant: ProductVariant) => {
    setEditing(variant);
    setName(variant.name);
    setPrice(variant.price.toString());
    setIsActive(variant.isActive);
    setInStock(variant.inStock);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!productId || !name.trim() || !price) return;

    const variantData = {
      productId,
      name: name.trim(),
      price: parseFloat(price),
      isActive,
      inStock,
    };

    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, ...variantData });
    } else {
      await createMutation.mutateAsync(variantData);
    }

    resetForm();
  };

  const handleDelete = async (variant: ProductVariant) => {
    if (!productId) return;
    await deleteMutation.mutateAsync({ id: variant.id, productId });
  };

  if (!productId) {
    return (
      <div className="text-sm text-muted-foreground">
        Save the product first to add variants
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Product Variants</Label>
        {!showForm && (
          <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-3 w-3" />
            Add Variant
          </Button>
        )}
      </div>

      {/* Variant form */}
      {showForm && (
        <Card>
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">
                {editing ? 'Edit Variant' : 'New Variant'}
              </h4>
              <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={resetForm}>
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="variant-name" className="text-xs">Name *</Label>
                <Input
                  id="variant-name"
                  placeholder="e.g., 500ML Container"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="variant-price" className="text-xs">Price (₹) *</Label>
                <Input
                  id="variant-price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Switch id="variant-active" checked={isActive} onCheckedChange={setIsActive} />
                <Label htmlFor="variant-active" className="text-xs">Active</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="variant-stock" checked={inStock} onCheckedChange={setInStock} />
                <Label htmlFor="variant-stock" className="text-xs">In Stock</Label>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                onClick={handleSubmit}
                disabled={!name.trim() || !price || createMutation.isPending || updateMutation.isPending}
                className="flex-1"
              >
                {editing ? 'Update' : 'Add'}
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Variants list */}
      {variants.length > 0 && (
        <div className="space-y-2">
          {variants.map((variant) => (
            <Card key={variant.id.toString()}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{variant.name}</span>
                      {!variant.isActive && (
                        <span className="text-xs text-muted-foreground">(Inactive)</span>
                      )}
                      {!variant.inStock && (
                        <span className="text-xs text-destructive">(Out of Stock)</span>
                      )}
                    </div>
                    <span className="text-sm text-primary font-semibold">₹{variant.price.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleEdit(variant)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(variant)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
