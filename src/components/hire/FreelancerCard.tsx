
import { memo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock } from "lucide-react";

interface FreelancerProps {
  freelancer: {
    id: string;
    name: string;
    role: string;
    location: string;
    rating: number;
    reviewCount: number;
    hourlyRate: string;
    avatar: string;
    specialties: string[];
    isAvailable: boolean;
  };
}

function FreelancerCard({ freelancer }: FreelancerProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="text-center pb-4">
        <div className="relative mx-auto mb-4">
          <img
            src={freelancer.avatar}
            alt={freelancer.name}
            className="w-20 h-20 rounded-full object-cover mx-auto"
            loading="lazy"
          />
          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${
            freelancer.isAvailable ? 'bg-green-500' : 'bg-gray-400'
          }`} />
        </div>
        <h3 className="font-semibold text-lg" style={{ color: '#1a2238' }}>
          {freelancer.name}
        </h3>
        <p className="text-sm" style={{ color: '#999999' }}>
          {freelancer.role}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Location and Rating */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1" style={{ color: '#999999' }}>
            <MapPin className="h-3 w-3" />
            {freelancer.location}
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{freelancer.rating}</span>
            <span style={{ color: '#999999' }}>({freelancer.reviewCount})</span>
          </div>
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1">
          {freelancer.specialties.map((specialty) => (
            <Badge key={specialty} variant="secondary" className="text-xs">
              {specialty}
            </Badge>
          ))}
        </div>

        {/* Rate and Availability */}
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span style={{ color: '#999999' }}>Rate: </span>
            <span className="font-semibold" style={{ color: '#1a2238' }}>
              {freelancer.hourlyRate}/hr
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Clock className="h-3 w-3" />
            <span style={{ color: freelancer.isAvailable ? '#10b981' : '#ef4444' }}>
              {freelancer.isAvailable ? 'Available' : 'Busy'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            style={{ borderColor: '#b99364', color: '#b99364' }}
          >
            View Profile
          </Button>
          <Button 
            size="sm" 
            className="flex-1 text-white"
            style={{ backgroundColor: '#556ee6' }}
            disabled={!freelancer.isAvailable}
          >
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(FreelancerCard);
