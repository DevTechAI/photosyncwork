
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { EstimateTemplate } from "../form/types";

// Predefined templates
export const estimateTemplates: EstimateTemplate[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean, contemporary design with a focus on visual presentation.",
    previewImage: "/placeholder.svg",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional layout with a professional and timeless feel.",
    previewImage: "/placeholder.svg",
  },
  {
    id: "bold",
    name: "Bold",
    description: "Eye-catching design with strong visual elements and color accents.",
    previewImage: "/placeholder.svg",
  }
];

interface TemplateSelectionPageProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
  isReadOnly?: boolean;
}

export function TemplateSelectionPage({
  selectedTemplate,
  onTemplateChange,
  isReadOnly = false,
}: TemplateSelectionPageProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-light">PRESENTATION STYLE</h2>
        {!isReadOnly && (
          <p className="text-sm text-muted-foreground mt-2">
            Choose a template design for your estimate presentation.
          </p>
        )}
      </div>

      {!isReadOnly ? (
        <RadioGroup
          value={selectedTemplate}
          onValueChange={onTemplateChange}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {estimateTemplates.map((template) => (
            <div key={template.id} className="relative">
              <RadioGroupItem
                value={template.id}
                id={`template-${template.id}`}
                className="sr-only"
              />
              <Label
                htmlFor={`template-${template.id}`}
                className="cursor-pointer"
              >
                <Card className={`overflow-hidden transition-all ${
                  selectedTemplate === template.id
                    ? "ring-2 ring-primary"
                    : "hover:border-primary/50"
                }`}>
                  <CardHeader className="p-4">
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <div className="aspect-video bg-muted flex items-center justify-center text-muted-foreground">
                    <img src={template.previewImage} alt={template.name} className="max-h-full" />
                  </div>
                  <CardFooter className="p-4 bg-muted/20">
                    {selectedTemplate === template.id ? (
                      <span className="text-primary font-medium">Selected</span>
                    ) : (
                      <span className="text-muted-foreground">Select this template</span>
                    )}
                  </CardFooter>
                </Card>
              </Label>
            </div>
          ))}
        </RadioGroup>
      ) : (
        <div className="text-center">
          <p className="text-lg font-medium">
            Selected Template: {estimateTemplates.find(t => t.id === selectedTemplate)?.name || "Default"}
          </p>
        </div>
      )}
    </div>
  );
}
