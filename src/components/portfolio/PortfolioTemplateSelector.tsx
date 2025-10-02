import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Camera, Mountain, ArrowRight, Palette } from "lucide-react";
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
  }
];

interface PortfolioTemplateSelectorProps {
  onTemplateSelect?: (template: PortfolioTemplate) => void;
}

export function PortfolioTemplateSelector({ onTemplateSelect }: PortfolioTemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<PortfolioTemplate | null>(null);
  const navigate = useNavigate();

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
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {portfolioTemplates.map((template) => (
              <div
                key={template.id}
                className={`relative cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedTemplate?.id === template.id
                    ? 'ring-2 ring-primary ring-offset-2'
                    : 'hover:shadow-sm'
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <Card className={`h-full ${selectedTemplate?.id === template.id ? template.color : ''}`}>
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
          
          {selectedTemplate && (
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
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
        </div>
      </CardContent>
    </Card>
  );
}


