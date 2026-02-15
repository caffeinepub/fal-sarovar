import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetAllProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/queries/useProducts';
import { useGetAllCategories } from '@/hooks/queries/useCategories';
import AdminShell from '@/components/admin/AdminShell';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProductImagesEditor from '@/components/admin/ProductImagesEditor';
import ProductVariantsEditor from '@/components/admin/ProductVariantsEditor';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Product, ExternalBlob } from '@/backend';
import { getBlobPreviewUrl } from '@/utils/blob';

export default function AdminProductsPage() {
  const { data: products, isLoading: productsLoading } = useGetAllProducts();
  const { data: categories, isLoading: categoriesLoading } = useGetAllCategories();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [healthBenefits, setHealthBenefits] = useState('');
  const [images, setImages] = useState<ExternalBlob[]>([]);
  const [inStock, setInStock] = useState(true);

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setName(product.name);
      setCategoryId(product.categoryId.toString());
      setDescription(product.description);
      setHealthBenefits(product.healthBenefits);
      setImages(product.images);
      setInStock(product.inStock);
    } else {
      setEditingProduct(null);
      setName('');
      setCategoryId('');
      setDescription('');
      setHealthBenefits('');
      setImages([]);
      setInStock(true);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProduct(null);
    setName('');
    setCategoryId('');
    setDescription('');
    setHealthBenefits('');
    setImages([]);
    setInStock(true);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !categoryId) return;

    const productData = {
      name: name.trim(),
      categoryId: BigInt(categoryId),
      description: description.trim(),
      healthBenefits: healthBenefits.trim(),
      images,
      inStock,
    };

    if (editingProduct) {
      await updateMutation.mutateAsync({
        id: editingProduct.id,
        ...productData,
      });
    } else {
      await createMutation.mutateAsync(productData);
    }

    handleCloseDialog();
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    await deleteMutation.mutateAsync(deletingProduct.id);
    setDeleteDialogOpen(false);
    setDeletingProduct(null);
  };

  if (productsLoading || categoriesLoading) {
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
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground mt-1">Manage your product catalog</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Products</CardTitle>
          </CardHeader>
          <CardContent>
            {products && products.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id.toString()}>
                      <TableCell>
                        {product.images.length > 0 ? (
                          <img
                            src={getBlobPreviewUrl(product.images[0])}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-muted rounded" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        {categories?.find(c => c.id === product.categoryId)?.name || 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.inStock ? 'default' : 'destructive'}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(product)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setDeletingProduct(product);
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
                <p className="text-muted-foreground">No products yet. Create your first one!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Create Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Update the product details below' : 'Add a new product to your catalog'}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" placeholder="Product name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id.toString()} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Product description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="healthBenefits">Health Benefits</Label>
                <Textarea
                  id="healthBenefits"
                  placeholder="Health benefits of this product"
                  value={healthBenefits}
                  onChange={(e) => setHealthBenefits(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch id="inStock" checked={inStock} onCheckedChange={setInStock} />
                <Label htmlFor="inStock">In Stock</Label>
              </div>
            </TabsContent>

            <TabsContent value="images" className="mt-4">
              <ProductImagesEditor images={images} onChange={setImages} />
            </TabsContent>

            <TabsContent value="variants" className="mt-4">
              <ProductVariantsEditor productId={editingProduct?.id || null} />
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!name.trim() || !categoryId || createMutation.isPending || updateMutation.isPending}
            >
              {editingProduct ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingProduct?.name}"? This action cannot be undone.
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
