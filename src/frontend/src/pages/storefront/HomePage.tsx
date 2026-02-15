import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { useGetAllProducts } from '@/hooks/queries/useProducts';
import Seo from '@/components/seo/Seo';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function HomePage() {
  const { data: products, isLoading } = useGetAllProducts();

  const bestSellers = products?.filter(p => p.inStock).slice(0, 3) || [];

  return (
    <>
      <Seo 
        title="Home" 
        description="Fal Sarovar - Fresh, healthy food for a better lifestyle. Plant-based meals, fresh juices, and nutritious options delivered to you."
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background">
        <div className="container-custom section-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="w-fit">
                <Leaf className="h-3 w-3 mr-1" />
                100% Fresh & Healthy
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Nourish Your Body with{' '}
                <span className="text-primary">Nature's Best</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Discover our range of fresh fruit salads, plant-based protein meals, dairy-free smoothies, 
                and detox drinks. Healthy eating made delicious and convenient.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/menu">
                  <Button size="lg" className="gap-2">
                    Order Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/assets/generated/fal-sarovar-hero.dim_1600x700.png" 
                alt="Fresh healthy food" 
                className="w-full h-auto rounded-2xl shadow-premium"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Healthy Message Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Why Choose Fal Sarovar?</h2>
            <p className="text-lg text-muted-foreground">
              We believe that healthy eating should be accessible, delicious, and sustainable. 
              Every meal is crafted with care using the freshest ingredients.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">100% Natural</h3>
                <p className="text-muted-foreground">
                  No artificial additives, preservatives, or added sugars. Just pure, wholesome ingredients.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Health Focused</h3>
                <p className="text-muted-foreground">
                  Designed by nutrition experts to support your wellness goals, from weight loss to muscle gain.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Fresh Daily</h3>
                <p className="text-muted-foreground">
                  Prepared fresh every day with locally sourced fruits and vegetables for maximum nutrition.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Our Best Sellers</h2>
            <p className="text-lg text-muted-foreground">
              Customer favorites that keep them coming back for more
            </p>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : bestSellers.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {bestSellers.map((product) => (
                <Card key={product.id.toString()} className="overflow-hidden hover:shadow-premium transition-shadow">
                  <div className="aspect-square bg-muted relative">
                    {product.image && (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <CardContent className="p-6 space-y-3">
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        ₹{product.price.toFixed(2)}
                      </span>
                      <Link to="/menu">
                        <Button size="sm">View Menu</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products available yet. Check back soon!</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/menu">
              <Button size="lg" variant="outline" className="gap-2">
                View Full Menu <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
