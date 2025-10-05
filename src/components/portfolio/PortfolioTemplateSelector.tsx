import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Camera, Mountain, ArrowRight, Palette, ChevronLeft, ChevronRight, Briefcase, Users, Home, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PortfolioTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  preview: string;
}

const portfolioTemplates: PortfolioTemplate[] = [
  {
    id: "wedding",
    name: "Wedding Photography",
    description: "Elegant and romantic templates perfect for wedding photographers",
    category: "Wedding",
    icon: <Heart className="h-6 w-6" />,
    color: "bg-pink-50 border-pink-200 text-pink-700",
    features: ["Romantic layouts", "Guest book integration", "Timeline showcase", "Love story section"],
    preview: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop"
  },
  {
    id: "wildlife",
    name: "Wildlife Photography",
    description: "Dynamic and nature-focused templates for wildlife photographers",
    category: "Wildlife",
    icon: <Mountain className="h-6 w-6" />,
    color: "bg-green-50 border-green-200 text-green-700",
    features: ["Nature galleries", "Species catalog", "Adventure stories", "Conservation focus"],
    preview: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"
  },
  {
    id: "passion",
    name: "Passion Photography",
    description: "Creative and artistic templates for passionate photographers",
    category: "Passion",
    icon: <Palette className="h-6 w-6" />,
    color: "bg-purple-50 border-purple-200 text-purple-700",
    features: ["Artistic layouts", "Creative showcases", "Personal stories", "Inspiration gallery"],
    preview: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop"
  },
  {
    id: "corporate",
    name: "Corporate Photography",
    description: "Professional business templates for corporate and commercial photographers",
    category: "Corporate",
    icon: <Briefcase className="h-6 w-6" />,
    color: "bg-blue-50 border-blue-200 text-blue-700",
    features: ["Professional layouts", "Team showcases", "Business galleries", "Client testimonials"],
    preview: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop"
  },
  {
    id: "portrait",
    name: "Portrait Photography",
    description: "Classic and modern templates for portrait photographers",
    category: "Portrait",
    icon: <Users className="h-6 w-6" />,
    color: "bg-orange-50 border-orange-200 text-orange-700",
    features: ["Portrait galleries", "Before/after", "Client stories", "Session packages"],
    preview: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
  },
  {
    id: "realestate",
    name: "Real Estate Photography",
    description: "Property-focused templates for real estate photographers",
    category: "Real Estate",
    icon: <Home className="h-6 w-6" />,
    color: "bg-teal-50 border-teal-200 text-teal-700",
    features: ["Property galleries", "Virtual tours", "Before/after", "Client portfolios"],
    preview: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop"
  },
  {
    id: "event",
    name: "Event Photography",
    description: "Dynamic templates for event and party photographers",
    category: "Event",
    icon: <Star className="h-6 w-6" />,
    color: "bg-yellow-50 border-yellow-200 text-yellow-700",
    features: ["Event galleries", "Timeline stories", "Party highlights", "Candid moments"],
    preview: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop"
  },
  {
    id: "fashion",
    name: "Fashion Photography",
    description: "Stylish templates for fashion and beauty photographers",
    category: "Fashion",
    icon: <Camera className="h-6 w-6" />,
    color: "bg-rose-50 border-rose-200 text-rose-700",
    features: ["Fashion galleries", "Lookbooks", "Beauty shots", "Style stories"],
    preview: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop"
  }
];

interface PortfolioTemplateSelectorProps {
  onTemplateSelect?: (template: PortfolioTemplate) => void;
}

export function PortfolioTemplateSelector({ onTemplateSelect }: PortfolioTemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<PortfolioTemplate | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  
  const templatesPerPage = 3;
  const totalPages = portfolioTemplates.length - templatesPerPage + 1;
  
  // Calculate transform for smooth sliding (accounting for padding)
  const slideTransform = `translateX(-${currentPage * (100 / templatesPerPage)}%)`;

  const handleTemplateSelect = (template: PortfolioTemplate) => {
    setSelectedTemplate(template);
  };

  const handleProceed = () => {
    if (selectedTemplate) {
      if (onTemplateSelect) {
        onTemplateSelect(selectedTemplate);
      } else {
        // Navigate to template page with selected template
        navigate(`/portfolio/template/${selectedTemplate.id}`);
      }
    }
  };

  const handleDoubleClick = (template: PortfolioTemplate) => {
    setSelectedTemplate(template);
    handleProceed();
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Select Portfolio Template
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose a template that best fits your photography style and brand
        </p>
      </CardHeader>
      <CardContent className="relative">
        <div className="relative">
          {/* Left Arrow - positioned at the very left edge */}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 p-0 rounded-full shadow-md bg-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {/* Right Arrow - positioned at the very right edge */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 p-0 rounded-full shadow-md bg-white"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-4">
              <span className="text-sm text-muted-foreground">
                {currentPage + 1}-{Math.min(currentPage + 3, portfolioTemplates.length)} of {portfolioTemplates.length}
              </span>
            </div>
            
            <div className="relative">
              <div className="overflow-hidden py-2">
                <div 
                  className="flex gap-4 transition-transform duration-500 ease-in-out px-2"
                  style={{ transform: slideTransform }}
                >
                  {portfolioTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`relative cursor-pointer transition-all duration-300 hover:shadow-md rounded-lg flex-shrink-0 w-full md:w-1/3 m-1 ${
                        selectedTemplate?.id === template.id
                          ? 'ring-2 ring-primary ring-offset-2'
                          : 'hover:shadow-sm'
                      }`}
                      onClick={() => handleTemplateSelect(template)}
                      onDoubleClick={() => handleDoubleClick(template)}
                    >
                      <Card className={`h-full rounded-lg ${selectedTemplate?.id === template.id ? template.color : ''}`}>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <div className={`p-2 rounded-lg ${template.color}`}>
                                {template.icon}
                              </div>
                              <div>
                                <h3 className="font-semibold">{template.name}</h3>
                                <Badge variant="secondary" className="text-xs">
                                  {template.category}
                                </Badge>
                              </div>
                            </div>
                            
                            <p className="text-sm text-muted-foreground">
                              {template.description}
                            </p>
                            
                            <div className="space-y-2">
                              <h4 className="text-xs font-medium text-muted-foreground">Features:</h4>
                              <div className="flex flex-wrap gap-1">
                                {template.features.map((feature, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                              <img
                                src={template.preview}
                                alt={`${template.name} preview`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {selectedTemplate?.id === template.id && (
                        <div className="absolute top-2 right-2">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {selectedTemplate && (
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg mt-4">
            <div>
              <h4 className="font-medium">Selected Template: {selectedTemplate.name}</h4>
              <p className="text-sm text-muted-foreground">
                Ready to customize your portfolio with this template
              </p>
            </div>
            <Button onClick={handleProceed} className="flex items-center gap-2">
              Proceed
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


