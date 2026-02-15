import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useGetAllCategories } from '@/hooks/queries/useCategories';
import { useGetAllProducts } from '@/hooks/queries/useProducts';
import { useGetVariantsByProduct } from '@/hooks/queries/useVariants';
import { useCart } from '@/state/useCart';
import Seo from '@/components/seo/Seo';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProductVariantPicker from '@/components/storefront/ProductVariantPicker';
import { ShoppingCart, Leaf } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/backend';
import { getBlobPreviewUrl } from '@/utils/blob';

export default function MenuPage() {
  const { data: categories, isLoading: categoriesLoading } = useGetAllCategories();
  const { data: products, isLoading: productsLoading } = useGetAllProducts();
  const { addItem } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVariantId, setSelectedVariantId] = useState<bigint | null>(null);

  const { data: variants = [] } = useGetVariantsByProduct(selectedProduct?.id || null);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products?.filter(p => p.categoryId.toString() === selectedCategory);

  const activeVariants = variants.filter((v) => v.isActive && v.inStock);
  const selectedVariant = activeVariants.find((v) => v.id === selectedVariantId);
  const displayPrice = selectedVariant?.price;

  const handleAddToCart = (product: Product) => {
    if (!product.inStock) {
      toast.error('This item is currently out of stock');
      return;
    }

    if (activeVariants.length > 0 && !selectedVariantId) {
      toast.error('Please select a size');
      return;
    }

    const variantName = selectedVariant?.name || null;
    const unitPrice = selectedVariant?.price || 0;

    addItem(product, 1, selectedVariantId || undefined, variantName || undefined, unitPrice);
    toast.success(`${product.name}${variantName ? ` (${variantName})` : ''} added to cart`);
  };

  const handleOpenDialog = (product: Product) => {
    setSelectedProduct(product);
    setSelectedVariantId(null);
  };

  const handleCloseDialog = () => {
    setSelectedProduct(null);
    setSelectedVariantId(null);
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
                {category.image && (
                  <img
                    src={getBlobPreviewUrl(category.image)}
                    alt=""
                    className="w-4 h-4 object-cover rounded mr-2"
                  />
                )}
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-8">
            {filteredProducts && filteredProducts.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {filteredProducts.map((product) => (
                  <Card 
                    key={product.id.toString()} 
                    className="overflow-hidden hover:shadow-premium transition-all cursor-pointer group mobile-product-card"
                    onClick={() => handleOpenDialog(product)}
                  >
                    <div className="aspect-square bg-muted relative overflow-hidden">
                      {product.images.length > 0 ? (
                        <img 
                          src={getBlobPreviewUrl(product.images[0])} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Leaf className="h-8 w-8 sm:h-16 sm:w-16 text-muted-foreground/30" />
                        </div>
                      )}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                          <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-2 sm:p-4 space-y-1 sm:space-y-3">
                      <div>
                        <h3 className="font-semibold text-xs sm:text-lg line-clamp-1">{product.name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 sm:line-clamp-2 mt-0.5 sm:mt-1 hidden sm:block">
                          {product.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <Button 
                          size="sm" 
                          disabled={!product.inStock}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDialog(product);
                          }}
                          className="gap-1 h-7 sm:h-9 text-xs sm:text-sm px-2 sm:px-4"
                        >
                          <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">Add</span>
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

      <Dialog open={!!selectedProduct} onOpenChange={handleCloseDialog}>
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
                {selectedProduct.images.length > 0 ? (
                  selectedProduct.images.length === 1 ? (
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <img 
                        src={getBlobPreviewUrl(selectedProduct.images[0])} 
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <Carousel className="w-full">
                      <CarouselContent>
                        {selectedProduct.images.map((image, index) => (
                          <CarouselItem key={index}>
                            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                              <img 
                                src={getBlobPreviewUrl(image)} 
                                alt={`${selectedProduct.name} ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  )
                ) : (
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                    <Leaf className="h-24 w-24 text-muted-foreground/30" />
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{selectedProduct.description}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Health Benefits</h3>
                    <p className="text-muted-foreground">{selectedProduct.healthBenefits}</p>
                  </div>

                  {activeVariants.length > 0 && (
                    <ProductVariantPicker
                      variants={activeVariants}
                      selectedVariantId={selectedVariantId}
                      onSelect={setSelectedVariantId}
                    />
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-3xl font-bold text-primary">
                      {displayPrice !== undefined ? `₹${displayPrice.toFixed(2)}` : 'Select size'}
                    </span>
                    <Button 
                      size="lg"
                      disabled={!selectedProduct.inStock || (activeVariants.length > 0 && !selectedVariantId)}
                      onClick={() => {
                        handleAddToCart(selectedProduct);
                        handleCloseDialog();
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
