
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Users, Calendar, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-light to-sky">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-ocean/10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/b5a2c474-15f8-4a49-b102-73278d7c52f1.png" 
                alt="StudioSync Logo" 
                className="h-28 w-auto object-contain"
              />
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={() => navigate('/login')} variant="outline" className="border-ocean/30 text-ocean-dark hover:bg-ocean/10">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-ocean-dark mb-4">
            Welcome to StudioSync
          </h2>
          <p className="text-xl text-ocean-muted max-w-2xl mx-auto">
            The complete platform for photographers, videographers, and their clients to collaborate seamlessly
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Client Portal Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/95 backdrop-blur-sm border-ocean/20 hover:border-ocean/40" onClick={() => navigate('/client-portal')}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-ocean/10 rounded-full w-fit">
                <Globe className="h-12 w-12 text-ocean-dark" />
              </div>
              <CardTitle className="text-2xl text-ocean-dark">Client Portal</CardTitle>
              <CardDescription className="text-base text-ocean-muted">
                Access your project deliverables, view photos and videos, and provide feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-ocean-muted space-y-2 mb-6">
                <li>✓ View and download your photos & videos</li>
                <li>✓ Browse gallery of your events</li>
                <li>✓ Provide feedback and approvals</li>
                <li>✓ Track project progress</li>
              </ul>
              <Button className="w-full bg-ocean hover:bg-ocean-dark text-white" size="lg">
                Access Client Portal
              </Button>
            </CardContent>
          </Card>

          {/* Photographers Portal Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/95 backdrop-blur-sm border-ocean/20 hover:border-ocean/40" onClick={() => navigate('/photographers')}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-ocean/10 rounded-full w-fit">
                <Users className="h-12 w-12 text-ocean-dark" />
              </div>
              <CardTitle className="text-2xl text-ocean-dark">Photographers Portal</CardTitle>
              <CardDescription className="text-base text-ocean-muted">
                Manage your studio, clients, projects, and team collaboration
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-ocean-muted space-y-2 mb-6">
                <li>✓ Project management & scheduling</li>
                <li>✓ Client relationship management</li>
                <li>✓ Team collaboration tools</li>
                <li>✓ Financial tracking & invoicing</li>
              </ul>
              <Button className="w-full bg-ocean hover:bg-ocean-dark text-white" size="lg">
                Access Studio Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-ocean-dark mb-8">Why Choose StudioSync?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-ocean/20 backdrop-blur-sm rounded-full w-fit">
                <Calendar className="h-8 w-8 text-ocean-dark" />
              </div>
              <h4 className="text-lg font-semibold mb-2 text-ocean-dark">Streamlined Workflow</h4>
              <p className="text-ocean-muted">From pre-production to delivery, manage every aspect of your photography business</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-ocean/20 backdrop-blur-sm rounded-full w-fit">
                <Users className="h-8 w-8 text-ocean-dark" />
              </div>
              <h4 className="text-lg font-semibold mb-2 text-ocean-dark">Client Collaboration</h4>
              <p className="text-ocean-muted">Keep clients engaged with real-time updates and seamless communication</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-ocean/20 backdrop-blur-sm rounded-full w-fit">
                <Camera className="h-8 w-8 text-ocean-dark" />
              </div>
              <h4 className="text-lg font-semibold mb-2 text-ocean-dark">Professional Tools</h4>
              <p className="text-ocean-muted">Everything you need to run a successful photography or videography business</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/95 backdrop-blur-sm border-t border-ocean/10 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-ocean-muted">
          <p>&copy; 2024 StudioSync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
