import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Seo from '@/components/seo/Seo';

export default function ContactPage() {
  return (
    <>
      <Seo 
        title="Contact Us" 
        description="Get in touch with Fal Sarovar for orders, inquiries, and feedback about our healthy food offerings."
      />
      <div className="container-custom section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
            <p className="text-lg text-muted-foreground">
              We'd love to hear from you. Reach out for orders, inquiries, or feedback.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Phone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Call us for orders and inquiries
                </p>
                <p className="text-lg font-semibold mt-2">+91 XXXXX XXXXX</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Send us your questions
                </p>
                <p className="text-lg font-semibold mt-2">info@falsarovar.com</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Visit us or order for delivery
                </p>
                <p className="text-lg font-semibold mt-2">Your City, India</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We're open daily
                </p>
                <p className="text-lg font-semibold mt-2">8:00 AM - 9:00 PM</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>About Fal Sarovar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Fal Sarovar is dedicated to providing fresh, healthy, and delicious food options 
                for health-conscious individuals. Our menu features a wide range of nutritious choices 
                including fresh fruit salads, plant-based protein meals, dairy-free smoothies, detox drinks, 
                and specialized meals for weight management.
              </p>
              <p>
                Every item is prepared fresh daily using high-quality, locally sourced ingredients. 
                We believe that healthy eating should be convenient, affordable, and most importantly, delicious.
              </p>
              <p>
                Whether you're looking to lose weight, gain muscle, detox, or simply maintain a healthy lifestyle, 
                we have something for everyone. Order online for quick delivery or visit us to experience 
                the freshness firsthand.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
