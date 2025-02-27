
import React from "react";

interface Project {
  name: string;
  status: "Completed" | "In Progress" | "Planning";
  progress: number;
}

interface ProjectProgressProps {
  projects: Project[];
}

export function ProjectProgress({ projects }: ProjectProgressProps) {
  return (
    <div className="space-y-3">
      <h4 className="font-medium text-sm">Projects</h4>
      {projects.map((project) => (
        <div key={project.name} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{project.name}</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              project.status === "Completed" 
                ? "bg-green-100 text-green-800"
                : project.status === "In Progress"
                ? "bg-blue-100 text-blue-800"
                : "bg-yellow-100 text-yellow-800"
            }`}>
              {project.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{project.progress}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}
