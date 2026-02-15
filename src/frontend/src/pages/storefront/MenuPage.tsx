import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useGetAllCategories } from '@/hooks/queries/useCategories';
import { useGetAllProducts } from '@/hooks/queries/useProducts';
import { useCart } from '@/state/useCart';
import Seo from '@/components/seo/Seo';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ShoppingCart, Leaf } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/backend';

export default function MenuPage() {
  const { data: categories, isLoading: categoriesLoading } = useGetAllCategories();
  const { data: products, isLoading: productsLoading } = useGetAllProducts();
  const { addItem } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products?.filter(p => p.categoryId.toString() === selectedCategory);

  const handleAddToCart = (product: Product) => {
    if (!product.inStock) {
      toast.error('This item is currently out of stock');
      return;
    }
    addItem(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  if (categoriesLoading || productsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Seo 
        title="Menu" 
        description="Browse our healthy menu featuring fresh fruit salads, plant-based protein meals, dairy-free smoothies, detox drinks, and more."
      />

      <div className="container-custom section-padding">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">Our Menu</h1>
          <p className="text-lg text-muted-foreground">
            Explore our selection of fresh, healthy meals and drinks crafted for your wellness
          </p>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-2 bg-transparent">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              All Items
            </TabsTrigger>
            {categories?.map((category) => (
              <TabsTrigger 
                key={category.id.toString()} 
                value={category.id.toString()}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-8">
            {filteredProducts && filteredProducts.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card 
                    key={product.id.toString()} 
                    className="overflow-hidden hover:shadow-premium transition-all cursor-pointer group"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="aspect-square bg-muted relative overflow-hidden">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Leaf className="h-16 w-16 text-muted-foreground/30" />
                        </div>
                      )}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                          <Badge variant="destructive">Out of Stock</Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {product.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary">
                          ₹{product.price.toFixed(2)}
                        </span>
                        <Button 
                          size="sm" 
                          disabled={!product.inStock}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          className="gap-2"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products available in this category</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Detail Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedProduct.name}</DialogTitle>
                <DialogDescription>
                  {categories?.find(c => c.id === selectedProduct.categoryId)?.name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  {selectedProduct.image ? (
                    <img 
                      src={selectedProduct.image} 
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Leaf className="h-24 w-24 text-muted-foreground/30" />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{selectedProduct.description}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Health Benefits</h3>
                    <p className="text-muted-foreground">{selectedProduct.healthBenefits}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-3xl font-bold text-primary">
                      ₹{selectedProduct.price.toFixed(2)}
                    </span>
                    <Button 
                      size="lg"
                      disabled={!selectedProduct.inStock}
                      onClick={() => {
                        handleAddToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="gap-2"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      {selectedProduct.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
