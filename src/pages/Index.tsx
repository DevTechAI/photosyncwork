
import Layout from "@/components/Layout";
import { useUser } from "@/contexts/UserContext";
import { ManagerDashboard } from "@/components/dashboard/ManagerDashboard";
import { DefaultDashboard } from "@/components/dashboard/DefaultDashboard";
import { PhotographerDashboard } from "@/components/dashboard/PhotographerDashboard";
import { VideographerDashboard } from "@/components/dashboard/VideographerDashboard";
import { EditorDashboard } from "@/components/dashboard/EditorDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Camera, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MediaTagger } from "@/components/ai/MediaTagger";

export default function Index() {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  // AI Feature Card for different user roles
  const AIFeatureCard = () => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bot className="mr-2 h-5 w-5" />
          AI Assistant
        </CardTitle>
        <CardDescription>
          AI-powered tools to enhance your workflow
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {(currentUser?.role === "manager" || currentUser?.role === "accounts") && (
          <div className="flex items-center justify-between p-2 border rounded-md">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-500" />
              <div>
                <h4 className="font-medium">Intelligent Scheduling</h4>
                <p className="text-sm text-muted-foreground">
                  Let AI suggest optimal team assignments
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/workflow/pre-production')}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}

        {(currentUser?.role === "photographer" || currentUser?.role === "videographer" || currentUser?.role === "editor") && (
          <div className="flex items-center justify-between p-2 border rounded-md">
            <div className="flex items-center">
              <Camera className="h-5 w-5 mr-2 text-blue-500" />
              <div>
                <h4 className="font-medium">Media Tagging</h4>
                <p className="text-sm text-muted-foreground">
                  Automatically tag and categorize media with AI
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/workflow/post-production')}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
        
        {/* Simple MediaTagger component for quick access on dashboard */}
        <div className="mt-4">
          <MediaTagger />
        </div>
      </CardContent>
    </Card>
  );

  // Manager Dashboard - Enhanced with financial overview
  if (currentUser?.role === "manager" || currentUser?.role === "accounts") {
    return (
      <Layout>
        <ManagerDashboard />
        <AIFeatureCard />
      </Layout>
    );
  }

  // Photographer Dashboard
  if (currentUser?.role === "photographer") {
    return (
      <Layout>
        <PhotographerDashboard />
        <AIFeatureCard />
      </Layout>
    );
  }

  // Videographer Dashboard
  if (currentUser?.role === "videographer") {
    return (
      <Layout>
        <VideographerDashboard />
        <AIFeatureCard />
      </Layout>
    );
  }

  // Editor Dashboard
  if (currentUser?.role === "editor") {
    return (
      <Layout>
        <EditorDashboard />
        <AIFeatureCard />
      </Layout>
    );
  }

  // Default Dashboard (fallback)
  return (
    <Layout>
      <DefaultDashboard />
      <AIFeatureCard />
    </Layout>
  );
}
