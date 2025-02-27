
import { FileText, Clock, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/stats/StatCard";

export function ProjectsTab() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Projects"
          value="15"
          icon={FileText}
          trend={{ value: 3, label: "vs last month" }}
        />
        <StatCard
          title="Completed"
          value="8"
          icon={FileText}
          trend={{ value: 2, label: "this month" }}
        />
        <StatCard
          title="In Progress"
          value="5"
          icon={Clock}
          trend={{ value: -1, label: "vs last month" }}
        />
        <StatCard
          title="Upcoming"
          value="2"
          icon={Calendar}
          trend={{ value: 0, label: "vs last month" }}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Mehra Wedding", type: "Wedding", stage: "Pre-Production", progress: 75 },
              { name: "TechCo Product Launch", type: "Corporate", stage: "Production", progress: 45 },
              { name: "Fashion Catalog", type: "Commercial", stage: "Post-Production", progress: 90 }
            ].map((project) => (
              <div key={project.name} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{project.name}</h4>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {project.type}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{project.stage}</p>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">{project.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
