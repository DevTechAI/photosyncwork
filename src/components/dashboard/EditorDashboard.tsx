
import { Edit, Clock, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/stats/StatCard";

export function EditorDashboard() {
  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Editor Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage your editing tasks and deliverables
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Pending Edits"
          value="6"
          icon={Edit}
          trend={{ value: -2, label: "vs last week" }}
        />
        <StatCard
          title="Completed Projects"
          value="8"
          icon={FileText}
          trend={{ value: 3, label: "vs last week" }}
        />
        <StatCard
          title="Estimated Hours"
          value="28"
          icon={Clock}
          trend={{ value: -5, label: "vs last week" }}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Editing Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Sharma Wedding Highlights</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Due: May 27, 2024
              </p>
              <div className="flex items-center mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "65%" }}></div>
                </div>
                <span className="text-xs text-muted-foreground ml-2">65%</span>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Product Catalog Photos</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Due: May 24, 2024
              </p>
              <div className="flex items-center mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "40%" }}></div>
                </div>
                <span className="text-xs text-muted-foreground ml-2">40%</span>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Corporate Training Video</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Due: May 30, 2024
              </p>
              <div className="flex items-center mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "20%" }}></div>
                </div>
                <span className="text-xs text-muted-foreground ml-2">20%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
