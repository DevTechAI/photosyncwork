import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Edit, Eye, Share2, Loader2 } from "lucide-react";
import { PortfolioGallery } from "@/components/portfolio/PortfolioGallery";
import { PortfolioEditor } from "@/components/portfolio/PortfolioEditor";
import { PortfolioPreview } from "@/components/portfolio/PortfolioPreview";
import { usePortfolioData } from "@/hooks/portfolio/usePortfolioData";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function Portfolio() {
  const { user } = useAuth();
  const { 
    portfolioData, 
    setPortfolioData, 
    isLoading, 
    isEditing, 
    setIsEditing, 
    showPreview, 
    setShowPreview, 
    handleSave,
    handleAddGalleryItem,
    handleRemoveGalleryItem,
    hasPortfolio
  } = usePortfolioData();

  // Handle upload complete from FileUploader
  const handleUploadComplete = (url: string, fileName: string) => {
    handleAddGalleryItem({
      url,
      title: fileName,
      category: "Portfolio"
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
              <Button onClick={() => {
                // In a real app, this would publish the portfolio
                setShowPreview(false);
              }}>
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Skeleton className="h-64 w-full mb-6" />
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
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
                {hasPortfolio ? "Edit Portfolio" : "Create Portfolio"}
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
            onUploadComplete={handleUploadComplete}
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
                      <h3 className="text-xl font-semibold">{portfolioData.name || "Your Portfolio Name"}</h3>
                      <p className="text-muted-foreground">{portfolioData.tagline || "Your professional tagline"}</p>
                    </div>
                    <p className="text-sm">{portfolioData.about || "Add a description about your photography style and experience."}</p>
                    {portfolioData.services.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Services</h4>
                        <div className="flex flex-wrap gap-2">
                          {portfolioData.services.map((service, index) => (
                            <div key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                              {service}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6">
                <PortfolioGallery 
                  images={portfolioData.gallery}
                  isEditing={false}
                  onImagesChange={() => {}}
                  onUploadComplete={handleUploadComplete}
                  onRemoveImage={handleRemoveGalleryItem}
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
                    <p className="text-sm text-muted-foreground">{portfolioData.contact.email || "Not set"}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Phone:</span>
                    <p className="text-sm text-muted-foreground">{portfolioData.contact.phone || "Not set"}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Location:</span>
                    <p className="text-sm text-muted-foreground">{portfolioData.contact.location || "Not set"}</p>
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
                    <div className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      {hasPortfolio ? "Published" : "Draft"}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {!user && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-blue-900 mb-2">Sign in to save your portfolio</h3>
                    <p className="text-sm text-blue-700 mb-3">
                      Create an account to save your portfolio and make it accessible to potential clients.
                    </p>
                    <Button 
                      onClick={() => navigate('/auth')}
                      className="w-full"
                      style={{ backgroundColor: '#556ee6' }}
                    >
                      Sign In or Create Account
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}