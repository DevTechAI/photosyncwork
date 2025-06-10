
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Camera, Edit, Plus, Trash2, Eye, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PortfolioGallery } from "@/components/portfolio/PortfolioGallery";
import { PortfolioEditor } from "@/components/portfolio/PortfolioEditor";
import { PortfolioPreview } from "@/components/portfolio/PortfolioPreview";

export default function Portfolio() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const [portfolioData, setPortfolioData] = useState({
    name: "John Doe Photography",
    tagline: "Capturing Life's Beautiful Moments",
    about: "Professional photographer specializing in weddings, portraits, and events. With over 5 years of experience, I bring creativity and passion to every shoot.",
    services: [
      "Wedding Photography",
      "Portrait Sessions",
      "Event Photography",
      "Corporate Headshots"
    ],
    contact: {
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY"
    },
    socialLinks: {
      instagram: "",
      facebook: "",
      website: ""
    },
    gallery: [
      {
        id: "1",
        url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
        title: "Mountain Landscape",
        category: "Nature"
      },
      {
        id: "2",
        url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800",
        title: "Foggy Summit",
        category: "Landscape"
      },
      {
        id: "3",
        url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800",
        title: "Ocean Wave",
        category: "Nature"
      }
    ]
  });

  const handleSave = () => {
    // In a real app, this would save to a database
    console.log("Saving portfolio data:", portfolioData);
    toast({
      title: "Portfolio saved",
      description: "Your portfolio has been updated successfully."
    });
    setIsEditing(false);
  };

  const handlePublish = () => {
    toast({
      title: "Portfolio published",
      description: "Your portfolio is now live and can be shared with clients."
    });
  };

  if (showPreview) {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-4 border-b bg-white shadow-sm">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              <span className="text-sm text-muted-foreground">Portfolio Preview</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Back to Editor
              </Button>
              <Button onClick={handlePublish}>
                <Share2 className="h-4 w-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>
        <PortfolioPreview data={portfolioData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Portfolio Manager</h1>
            <p className="text-muted-foreground">Create and manage your photography showcase</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowPreview(true)}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Portfolio
              </Button>
            )}
          </div>
        </div>

        {isEditing ? (
          <PortfolioEditor 
            data={portfolioData} 
            onChange={setPortfolioData}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold">{portfolioData.name}</h3>
                      <p className="text-muted-foreground">{portfolioData.tagline}</p>
                    </div>
                    <p className="text-sm">{portfolioData.about}</p>
                    <div>
                      <h4 className="font-medium mb-2">Services</h4>
                      <div className="flex flex-wrap gap-2">
                        {portfolioData.services.map((service, index) => (
                          <Badge key={index} variant="secondary">{service}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6">
                <PortfolioGallery 
                  images={portfolioData.gallery}
                  isEditing={false}
                />
              </div>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Email:</span>
                    <p className="text-sm text-muted-foreground">{portfolioData.contact.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Phone:</span>
                    <p className="text-sm text-muted-foreground">{portfolioData.contact.phone}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Location:</span>
                    <p className="text-sm text-muted-foreground">{portfolioData.contact.location}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Gallery Images</span>
                    <span className="text-sm font-medium">{portfolioData.gallery.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Services Listed</span>
                    <span className="text-sm font-medium">{portfolioData.services.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Portfolio Status</span>
                    <Badge variant="outline" className="text-xs">Draft</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
