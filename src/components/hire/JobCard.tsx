
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, DollarSign, Clock } from "lucide-react";

interface JobProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    budget: string;
    date: string;
    description: string;
    requirements: string[];
    postedDate: string;
  };
}

export function JobCard({ job }: JobProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2" style={{ color: '#1a2238' }}>
              {job.title}
            </CardTitle>
            <p className="font-medium mb-1" style={{ color: '#b99364' }}>
              {job.company}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: '#999999' }}>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {job.location}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {job.date}
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {job.budget}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {job.postedDate}
              </div>
            </div>
          </div>
          <Badge variant={job.type === "Contract" ? "default" : "secondary"}>
            {job.type}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm" style={{ color: '#1a2238' }}>
          {job.description}
        </p>

        {/* Requirements */}
        <div>
          <h4 className="text-sm font-medium mb-2" style={{ color: '#1a2238' }}>
            Requirements:
          </h4>
          <ul className="text-sm space-y-1" style={{ color: '#999999' }}>
            {job.requirements.map((req, index) => (
              <li key={index} className="flex items-start gap-1">
                <span className="text-green-500">•</span>
                {req}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm"
            style={{ borderColor: '#b99364', color: '#b99364' }}
          >
            Save Job
          </Button>
          <Button 
            size="sm" 
            className="text-white"
            style={{ backgroundColor: '#556ee6' }}
          >
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
