
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Camera } from "lucide-react";

interface ClientLoginProps {
  onLogin: (accessCode: string) => void;
  loading: boolean;
  error: string | null;
}

export function ClientLogin({ onLogin, loading, error }: ClientLoginProps) {
  const [accessCode, setAccessCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode.trim()) {
      onLogin(accessCode.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <Camera className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Client Portal</CardTitle>
          <CardDescription>
            Enter your access code to view your project deliverables
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accessCode">Access Code</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="accessCode"
                  type="text"
                  placeholder="Enter your access code"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading || !accessCode.trim()}>
              {loading ? "Verifying..." : "Access Portal"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Don't have an access code?</p>
            <p>Contact your photographer or videographer for access.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
