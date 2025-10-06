import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { PortfolioGallery } from "./PortfolioGallery";
import { FileUploader } from "./FileUploader";

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

interface PortfolioEditorProps {
  data: PortfolioData;
  onChange: (data: PortfolioData) => void;
  onSave: () => void;
  onCancel: () => void;
  onUploadComplete?: (url: string, fileName: string) => void;
}

export function PortfolioEditor({ 
  data, 
  onChange, 
  onSave, 
  onCancel,
  onUploadComplete
}: PortfolioEditorProps) {
  const [newService, setNewService] = useState("");

  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const updateContactField = (field: string, value: string) => {
    onChange({
      ...data,
      contact: { ...data.contact, [field]: value }
    });
  };

  const updateSocialField = (field: string, value: string) => {
    onChange({
      ...data,
      socialLinks: { ...data.socialLinks, [field]: value }
    });
  };

  const addService = () => {
    if (newService.trim()) {
      updateField("services", [...data.services, newService.trim()]);
      setNewService("");
    }
  };

  const removeService = (index: number) => {
    updateField("services", data.services.filter((_, i) => i !== index));
  };

  const updateGallery = (gallery: any[]) => {
    updateField("gallery", gallery);
  };

  const handleUploadComplete = (url: string, fileName: string) => {
    if (onUploadComplete) {
      onUploadComplete(url, fileName);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Portfolio Name</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Sarah Johnson Photography"
              />
            </div>
            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={data.tagline}
                onChange={(e) => updateField("tagline", e.target.value)}
                placeholder="Capturing life's beautiful moments with artistic vision"
              />
            </div>
            <div>
              <Label htmlFor="about">About</Label>
              <Textarea
                id="about"
                value={data.about}
                onChange={(e) => updateField("about", e.target.value)}
                placeholder="I'm Sarah Johnson, a passionate photographer specializing in portrait, event, and commercial photography. With over 5 years of experience, I bring a unique blend of technical expertise and creative vision to every project. My style combines natural lighting with authentic moments, creating timeless images that tell your story beautifully. I believe every moment has a story worth telling, and I'm here to help you preserve those precious memories with stunning, professional photography."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={data.contact.email}
                onChange={(e) => updateContactField("email", e.target.value)}
                placeholder="sarah.johnson@email.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={data.contact.phone}
                onChange={(e) => updateContactField("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={data.contact.location}
                onChange={(e) => updateContactField("location", e.target.value)}
                placeholder="San Francisco, CA"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                placeholder="e.g., Portrait Photography, Wedding Photography, Corporate Events"
                onKeyPress={(e) => e.key === "Enter" && addService()}
              />
              <Button onClick={addService}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.services.map((service, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {service}
                  <button
                    onClick={() => removeService(index)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={data.socialLinks.instagram}
                onChange={(e) => updateSocialField("instagram", e.target.value)}
                placeholder="@sarahjohnson_photography"
              />
            </div>
            <div>
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={data.socialLinks.facebook}
                onChange={(e) => updateSocialField("facebook", e.target.value)}
                placeholder="facebook.com/sarahjohnsonphotography"
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={data.socialLinks.website}
                onChange={(e) => updateSocialField("website", e.target.value)}
                placeholder="www.sarahjohnsonphotography.com"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUploader 
            onUploadComplete={handleUploadComplete}
            acceptedFileTypes="image/*"
            maxFileSize={10}
            folder="portfolio"
          />
          
          <div className="mt-6">
            <PortfolioGallery 
              images={data.gallery}
              isEditing={true}
              onImagesChange={updateGallery}
              onUploadComplete={handleUploadComplete}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave}>
          Save Portfolio
        </Button>
      </div>
    </div>
  );
}