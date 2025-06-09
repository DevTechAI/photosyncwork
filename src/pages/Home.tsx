
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Users, Calendar, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-royal to-royal-dark">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/975fd3f7-81ca-4879-af49-a6619fae8aba.png" 
                alt="StudioSync Logo" 
                className="h-28 w-auto object-contain"
              />
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={() => navigate('/login')} variant="outline">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Welcome to StudioSync
          </h2>
          <p className="text-xl text-royal-foreground/90 max-w-2xl mx-auto">
            The complete platform for photographers, videographers, and their clients to collaborate seamlessly
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Client Portal Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/95 backdrop-blur-sm" onClick={() => navigate('/client-portal')}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-blue-50 rounded-full w-fit">
                <Globe className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Client Portal</CardTitle>
              <CardDescription className="text-base">
                Access your project deliverables, view photos and videos, and provide feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>✓ View and download your photos & videos</li>
                <li>✓ Browse gallery of your events</li>
                <li>✓ Provide feedback and approvals</li>
                <li>✓ Track project progress</li>
              </ul>
              <Button className="w-full" size="lg">
                Access Client Portal
              </Button>
            </CardContent>
          </Card>

          {/* Photographers Portal Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/95 backdrop-blur-sm" onClick={() => navigate('/photographers')}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-purple-50 rounded-full w-fit">
                <Users className="h-12 w-12 text-purple-600" />
              </div>
              <CardTitle className="text-2xl">Photographers Portal</CardTitle>
              <CardDescription className="text-base">
                Manage your studio, clients, projects, and team collaboration
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>✓ Project management & scheduling</li>
                <li>✓ Client relationship management</li>
                <li>✓ Team collaboration tools</li>
                <li>✓ Financial tracking & invoicing</li>
              </ul>
              <Button className="w-full" size="lg">
                Access Studio Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-8">Why Choose StudioSync?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-white/20 backdrop-blur-sm rounded-full w-fit">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold mb-2 text-white">Streamlined Workflow</h4>
              <p className="text-royal-foreground/80">From pre-production to delivery, manage every aspect of your photography business</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-white/20 backdrop-blur-sm rounded-full w-fit">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold mb-2 text-white">Client Collaboration</h4>
              <p className="text-royal-foreground/80">Keep clients engaged with real-time updates and seamless communication</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-white/20 backdrop-blur-sm rounded-full w-fit">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold mb-2 text-white">Professional Tools</h4>
              <p className="text-royal-foreground/80">Everything you need to run a successful photography or videography business</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/95 backdrop-blur-sm border-t mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2024 StudioSync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
