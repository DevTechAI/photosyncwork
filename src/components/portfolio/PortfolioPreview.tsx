
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Instagram, Facebook, Globe } from "lucide-react";

interface PortfolioData {
  name: string;
  tagline: string;
  about: string;
  services: string[];
  contact: {
    email: string;
    phone: string;
    location: string;
  };
  socialLinks: {
    instagram: string;
    facebook: string;
    website: string;
  };
  gallery: Array<{
    id: string;
    url: string;
    title: string;
    category: string;
  }>;
}

interface PortfolioPreviewProps {
  data: PortfolioData;
}

export function PortfolioPreview({ data }: PortfolioPreviewProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-gray-900 to-gray-700 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">{data.name}</h1>
          <p className="text-xl text-gray-200">{data.tagline}</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* About Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">About</h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-600 leading-relaxed">{data.about}</p>
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.services.map((service, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg">{service}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Gallery Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Portfolio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.gallery.map((image) => (
              <div key={image.id} className="group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{image.title}</h3>
                  <Badge variant="outline" className="mt-2">
                    {image.category}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-gray-600">{data.contact.email}</p>
            </div>
            <div className="flex flex-col items-center">
              <Phone className="h-8 w-8 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="text-gray-600">{data.contact.phone}</p>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="h-8 w-8 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Location</h3>
              <p className="text-gray-600">{data.contact.location}</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-4">
            {data.socialLinks.instagram && (
              <Button variant="outline" size="icon">
                <Instagram className="h-4 w-4" />
              </Button>
            )}
            {data.socialLinks.facebook && (
              <Button variant="outline" size="icon">
                <Facebook className="h-4 w-4" />
              </Button>
            )}
            {data.socialLinks.website && (
              <Button variant="outline" size="icon">
                <Globe className="h-4 w-4" />
              </Button>
            )}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p>&copy; 2024 {data.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
