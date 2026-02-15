import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetAllProducts } from '@/hooks/queries/useProducts';
import { useGetVariantsByProduct } from '@/hooks/queries/useVariants';
import { useCart } from '@/state/useCart';
import Seo from '@/components/seo/Seo';
import { Leaf, Heart, Users, Award, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/backend';
import { getBlobPreviewUrl } from '@/utils/blob';

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { data: variants = [] } = useGetVariantsByProduct(product.id);
  const activeVariants = variants.filter((v) => v.isActive && v.inStock);
  const lowestPrice = activeVariants.length > 0 
    ? Math.min(...activeVariants.map(v => v.price))
    : null;

  const handleQuickAdd = () => {
    if (!product.inStock) {
      toast.error('This item is currently out of stock');
      return;
    }
    
    if (activeVariants.length > 0) {
      toast.info('Please select a size from the menu page');
      return;
    }
    
    addItem(product, 1, undefined, undefined, 0);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-premium transition-all group">
      <Link to="/menu">
        <div className="aspect-square bg-muted relative overflow-hidden">
          {product.images.length > 0 ? (
            <img 
              src={getBlobPreviewUrl(product.images[0])} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Leaf className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>
        <div className="flex items-center justify-between">
          {lowestPrice !== null ? (
            <span className="text-xl font-bold text-primary">
              From ₹{lowestPrice.toFixed(2)}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">View menu</span>
          )}
          <Link to="/menu">
            <Button size="sm" variant="outline">
              View
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  const { data: products } = useGetAllProducts();
  const bestSellers = products?.slice(0, 6) || [];

  return (
    <>
      <Seo 
        title="Home" 
        description="Fal Sarovar - Fresh, healthy meals and drinks for your wellness journey. Discover our menu of nutritious fruit salads, protein bowls, smoothies, and detox drinks."
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden">
        <div className="container-custom section-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Fresh, Healthy Meals
                <span className="block text-primary mt-2">Delivered Daily</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Experience the perfect blend of taste and nutrition with our carefully crafted menu. 
                From fresh fruit salads to protein-packed meals, we've got your wellness covered.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/menu">
                  <Button size="lg" className="gap-2">
                    Browse Menu <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-premium">
              <img 
                src="/assets/generated/fal-sarovar-hero.dim_1600x700.png" 
                alt="Fresh healthy food"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container-custom section-padding">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Why Choose Fal Sarovar?</h2>
          <p className="text-lg text-muted-foreground">
            We're committed to bringing you the freshest, healthiest options every day
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center p-6 hover:shadow-premium transition-all">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Leaf className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">100% Fresh</h3>
            <p className="text-sm text-muted-foreground">
              All ingredients sourced fresh daily for maximum nutrition
            </p>
          </Card>

          <Card className="text-center p-6 hover:shadow-premium transition-all">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Health First</h3>
            <p className="text-sm text-muted-foreground">
              Carefully crafted recipes focusing on your wellness
            </p>
          </Card>

          <Card className="text-center p-6 hover:shadow-premium transition-all">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Made with Care</h3>
            <p className="text-sm text-muted-foreground">
              Prepared by our expert team with attention to detail
            </p>
          </Card>

          <Card className="text-center p-6 hover:shadow-premium transition-all">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Quality Assured</h3>
            <p className="text-sm text-muted-foreground">
              Highest standards in food safety and quality
            </p>
          </Card>
        </div>
      </section>

      {/* Best Sellers Section */}
      {bestSellers.length > 0 && (
        <section className="bg-muted/30">
          <div className="container-custom section-padding">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Popular Items</h2>
              <p className="text-lg text-muted-foreground">
                Try our customer favorites
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bestSellers.map((product) => (
                <ProductCard key={product.id.toString()} product={product} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/menu">
                <Button size="lg" variant="outline" className="gap-2">
                  View Full Menu <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
