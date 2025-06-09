
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Download, Wand2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LogoGeneratorProps {
  onLogoGenerated?: (logoUrl: string) => void;
}

export function LogoGenerator({ onLogoGenerated }: LogoGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLogo, setGeneratedLogo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateLogo = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('generate-logo');

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate logo');
      }

      // Convert base64 to data URL
      const logoDataUrl = `data:image/png;base64,${data.imageData}`;
      setGeneratedLogo(logoDataUrl);
      
      if (onLogoGenerated) {
        onLogoGenerated(logoDataUrl);
      }
    } catch (err) {
      console.error('Error generating logo:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate logo');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadLogo = () => {
    if (!generatedLogo) return;

    const link = document.createElement('a');
    link.href = generatedLogo;
    link.download = 'studiosync-logo.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          StudioSync Logo Generator
        </CardTitle>
        <CardDescription>
          Generate a bold, elegant and luxurious logo for StudioSync
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        {generatedLogo ? (
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-gray-50">
              <img 
                src={generatedLogo} 
                alt="Generated StudioSync Logo" 
                className="w-full h-auto max-h-48 object-contain mx-auto"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={generateLogo} disabled={isGenerating} className="flex-1">
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate New Logo'
                )}
              </Button>
              <Button onClick={downloadLogo} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        ) : (
          <Button onClick={generateLogo} disabled={isGenerating} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Logo...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Logo
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
