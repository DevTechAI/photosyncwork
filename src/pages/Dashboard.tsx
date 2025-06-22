
import React from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Camera, 
  DollarSign, 
  Calendar, 
  FileText, 
  Upload, 
  Users, 
  Receipt,
  BarChart3,
  Settings,
  Image,
  Video,
  Edit
} from "lucide-react";
import { StatCard } from "@/components/stats/StatCard";

export default function Dashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Quick action modules
  const modules = [
    {
      title: "Estimates",
      description: "Create and manage project estimates",
      icon: FileText,
      path: "/estimates",
      color: "bg-blue-500"
    },
    {
      title: "Scheduling",
      description: "Schedule events and manage calendar",
      icon: Calendar,
      path: "/scheduling",
      color: "bg-green-500"
    },
    {
      title: "Finances",
      description: "Track income, expenses and reports",
      icon: DollarSign,
      path: "/finances",
      color: "bg-yellow-500"
    },
    {
      title: "Invoices",
      description: "Generate and manage invoices",
      icon: Receipt,
      path: "/invoices",
      color: "bg-purple-500"
    },
    {
      title: "Portfolio",
      description: "Upload and showcase your work",
      icon: Camera,
      path: "/portfolio",
      color: "bg-pink-500"
    },
    {
      title: "Workflow",
      description: "Manage pre/production/post workflows",
      icon: BarChart3,
      path: "/workflow/pre-production",
      color: "bg-indigo-500"
    }
  ];

  // Upload options
  const uploadOptions = [
    {
      title: "Upload Photos",
      description: "Add photos to your portfolio",
      icon: Image,
      action: () => navigate("/portfolio")
    },
    {
      title: "Upload Videos", 
      description: "Add videos to your collection",
      icon: Video,
      action: () => navigate("/portfolio")
    },
    {
      title: "Import Data",
      description: "Import financial data or contacts",
      icon: Upload,
      action: () => navigate("/finances")
    }
  ];

  return (
    <Layout>
      <div className="space-y-8 p-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name || user?.email}!</h1>
            <p className="text-muted-foreground mt-2">
              Manage your photography business with all tools in one place
            </p>
          </div>
          <Button onClick={() => navigate("/settings")} variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Active Projects"
            value="12"
            icon={FileText}
            trend={{ value: 3, label: "vs last month" }}
          />
          <StatCard
            title="Monthly Revenue"
            value="₹2,48,000"
            icon={DollarSign}
            trend={{ value: 12, label: "vs last month" }}
          />
          <StatCard
            title="Upcoming Events"
            value="6"
            icon={Calendar}
            trend={{ value: 2, label: "vs last week" }}
          />
          <StatCard
            title="Pending Invoices"
            value="4"
            icon={Receipt}
            trend={{ value: -1, label: "vs last week" }}
          />
        </div>

        {/* Quick Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Quick Upload
            </CardTitle>
            <CardDescription>
              Upload content and data to get started quickly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {uploadOptions.map((option) => (
                <Button
                  key={option.title}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={option.action}
                >
                  <option.icon className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-medium">{option.title}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* All Modules */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">All Modules</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <Card 
                key={module.title} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(module.path)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${module.color}`}>
                      <module.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <CardDescription>{module.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Open {module.title}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="p-2 bg-green-100 rounded-full">
                  <FileText className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">New estimate created</p>
                  <p className="text-sm text-muted-foreground">Wedding photography for Kumar family</p>
                </div>
                <span className="text-xs text-muted-foreground">2 hours ago</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Event scheduled</p>
                  <p className="text-sm text-muted-foreground">Pre-wedding shoot on May 25th</p>
                </div>
                <span className="text-xs text-muted-foreground">1 day ago</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Receipt className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Invoice payment received</p>
                  <p className="text-sm text-muted-foreground">₹50,000 from Sharma Wedding</p>
                </div>
                <span className="text-xs text-muted-foreground">3 days ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
