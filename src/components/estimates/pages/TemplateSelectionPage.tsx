
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { EstimateTemplate } from "../form/types";

// Predefined templates with updated descriptions and styling
export const estimateTemplates: EstimateTemplate[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean, contemporary design with subtle gradients and rounded elements.",
    previewImage: "/placeholder.svg",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Elegant, timeless layout with serif fonts and traditional styling.",
    previewImage: "/placeholder.svg",
  },
  {
    id: "bold",
    name: "Bold",
    description: "Eye-catching design with strong accents and modern typography.",
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
            Choose a template design for your estimate presentation and emails.
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
                  <CardHeader className={`p-4 ${template.id === 'bold' ? 'bg-black text-white' : 
                                              template.id === 'classic' ? 'bg-gray-100' : 
                                              'bg-gradient-to-r from-blue-50 to-blue-100'}`}>
                    <CardTitle className={`${template.id === 'bold' ? 'uppercase font-bold' : 
                                           template.id === 'classic' ? 'font-serif' : 
                                           'font-medium'}`}>{template.name}</CardTitle>
                    <CardDescription className={`${template.id === 'bold' ? 'text-gray-300' : 
                                                template.id === 'classic' ? 'font-serif italic' : 
                                                'text-blue-600'}`}>
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <div className={`w-full h-full p-2 flex flex-col items-center justify-center ${
                      template.id === 'bold' ? 'bg-gray-900 text-white' :
                      template.id === 'classic' ? 'bg-gray-50 border border-gray-200' :
                      'bg-white'
                    }`}>
                      <div className={`text-center mb-2 ${
                        template.id === 'bold' ? 'uppercase font-bold text-lg' :
                        template.id === 'classic' ? 'font-serif italic text-lg' :
                        'text-lg text-blue-600'
                      }`}>
                        STUDIOSYNC
                      </div>
                      <div className={`w-4/5 h-2 mb-2 ${
                        template.id === 'bold' ? 'bg-pink-500' :
                        template.id === 'classic' ? 'bg-gray-300' :
                        'bg-gradient-to-r from-blue-300 to-blue-500'
                      }`}></div>
                      <div className={`w-full flex gap-2 justify-center ${
                        template.id === 'bold' ? 'mt-2' :
                        template.id === 'classic' ? 'mt-2 font-serif' :
                        'mt-2'
                      }`}>
                        <div className={`w-1/3 h-8 ${
                          template.id === 'bold' ? 'bg-gray-800 border-b-2 border-pink-500' :
                          template.id === 'classic' ? 'bg-white border border-gray-300' :
                          'bg-white shadow-sm rounded-md'
                        }`}></div>
                        <div className={`w-1/3 h-8 ${
                          template.id === 'bold' ? 'bg-gray-800 border-b-2 border-pink-500' :
                          template.id === 'classic' ? 'bg-white border border-gray-300' :
                          'bg-white shadow-sm rounded-md'
                        }`}></div>
                      </div>
                    </div>
                  </div>
                  <CardFooter className={`p-4 ${
                    template.id === 'bold' ? 'bg-gray-800 text-white' :
                    template.id === 'classic' ? 'bg-gray-100 font-serif' :
                    'bg-gradient-to-r from-blue-50 to-blue-100'
                  }`}>
                    {selectedTemplate === template.id ? (
                      <span className={`${
                        template.id === 'bold' ? 'text-pink-400 font-bold uppercase' :
                        template.id === 'classic' ? 'text-gray-700 italic' :
                        'text-blue-600 font-medium'
                      }`}>Selected</span>
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
