
import { FileText, Clock, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/stats/StatCard";
import { useEffect, useState } from "react";
import { ScheduledEvent } from "@/components/scheduling/types";
import { format, isAfter, parseISO } from "date-fns";

export function ProjectsTab() {
  const [activeProjects, setActiveProjects] = useState(0);
  const [completedProjects, setCompletedProjects] = useState(0);
  const [inProgressProjects, setInProgressProjects] = useState(0);
  const [upcomingProjects, setUpcomingProjects] = useState(0);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    // Load events from localStorage
    const savedEvents = localStorage.getItem("scheduledEvents");
    if (savedEvents) {
      const events: ScheduledEvent[] = JSON.parse(savedEvents);
      const today = new Date();
      
      // Count projects by status
      let active = 0;
      let completed = 0;
      let inProgress = 0;
      let upcoming = 0;
      
      const projectsList = events.map(event => {
        const eventDate = parseISO(event.date);
        let stage = event.stage;
        let progress = 0;
        
        // Calculate progress based on stage
        if (stage === "pre-production") {
          progress = 25;
          upcoming++;
        } else if (stage === "production") {
          progress = 50;
          inProgress++;
        } else if (stage === "post-production") {
          progress = 75;
          active++;
        } else if (stage === "completed") {
          progress = 100;
          completed++;
        }
        
        // If date has passed, mark as completed for display purposes
        if (isAfter(today, eventDate) && stage === "pre-production") {
          stage = "post-production";
        }
        
        return {
          name: event.name,
          type: "Event",  // Default type
          stage: stage,
          progress: progress,
          date: format(eventDate, 'MMM dd, yyyy')
        };
      });
      
      // Set state values
      setActiveProjects(active);
      setCompletedProjects(completed);
      setInProgressProjects(inProgress);
      setUpcomingProjects(upcoming);
      setProjects(projectsList.slice(0, 5)); // Show only the first 5 projects
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Projects"
          value={activeProjects.toString()}
          icon={FileText}
          trend={{ value: 0, label: "vs last month" }}
        />
        <StatCard
          title="Completed"
          value={completedProjects.toString()}
          icon={FileText}
          trend={{ value: 0, label: "this month" }}
        />
        <StatCard
          title="In Progress"
          value={inProgressProjects.toString()}
          icon={Clock}
          trend={{ value: 0, label: "vs last month" }}
        />
        <StatCard
          title="Upcoming"
          value={upcomingProjects.toString()}
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
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{project.name}</h4>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {project.type}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground mb-2">{project.stage}</p>
                    <p className="text-xs text-muted-foreground">{project.date}</p>
                  </div>
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
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No projects available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
