
import { memo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, ExternalLink, Mail, Phone, Globe, Instagram, Eye } from "lucide-react";
import { FreelancerWithPortfolio } from "@/types/hire";

interface FreelancerProps {
  freelancer: FreelancerWithPortfolio;
  onViewPortfolio?: (freelancer: FreelancerWithPortfolio) => void;
}

function FreelancerCard({ freelancer, onViewPortfolio }: FreelancerProps) {
  const handleViewPortfolio = () => {
    if (onViewPortfolio) {
      onViewPortfolio(freelancer);
    }
  };

  const handleCardClick = () => {
    // Always open portfolio modal/dialog
    if (onViewPortfolio) {
      onViewPortfolio(freelancer);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleCardClick}>
      <CardHeader className="text-center pb-4">
        <div className="relative mx-auto mb-4">
          <img
            src={freelancer.avatar || "/placeholder-avatar.jpg"}
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
        {freelancer.experience_years && (
          <p className="text-xs text-blue-600 font-medium">
            {freelancer.experience_years} years experience
          </p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Location and Rating */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1" style={{ color: '#999999' }}>
            <MapPin className="h-3 w-3" />
            <span>{freelancer.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{freelancer.rating?.toFixed(1) || '0.0'}</span>
            <span className="text-xs" style={{ color: '#999999' }}>
              ({freelancer.reviewCount || 0})
            </span>
          </div>
        </div>

        {/* Bio */}
        {freelancer.bio && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {freelancer.bio}
          </p>
        )}

        {/* Specialties */}
        <div className="flex flex-wrap gap-1">
          {freelancer.specialties?.slice(0, 3).map((specialty, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {specialty}
            </Badge>
          ))}
          {freelancer.specialties?.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{freelancer.specialties.length - 3} more
            </Badge>
          )}
        </div>

        {/* Hourly Rate */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-3 w-3" style={{ color: '#999999' }} />
            <span className="font-medium" style={{ color: '#1a2238' }}>
              {freelancer.hourlyRate || 'Rate not specified'}
            </span>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-2">
          {freelancer.email && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Mail className="h-3 w-3" />
              <span className="truncate">{freelancer.email}</span>
            </div>
          )}
          {freelancer.phone && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Phone className="h-3 w-3" />
              <span>{freelancer.phone}</span>
            </div>
          )}
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-2">
          {freelancer.website && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                window.open(freelancer.website, '_blank');
              }}
            >
              <Globe className="h-3 w-3" />
            </Button>
          )}
          {freelancer.instagram && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                window.open(freelancer.instagram, '_blank');
              }}
            >
              <Instagram className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Portfolio Link */}
        {freelancer.portfolio && (
          <Button
            onClick={handleViewPortfolio}
            className="w-full text-white"
            style={{ backgroundColor: '#556ee6' }}
            size="sm"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Portfolio
          </Button>
        )}

        {/* External Portfolio Link */}
        {freelancer.portfolio_url && !freelancer.portfolio && (
          <Button
            variant="outline"
            className="w-full"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              window.open(freelancer.portfolio_url, '_blank');
            }}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            External Portfolio
          </Button>
        )}

        {/* PhotoSync Portfolio Button */}
        <Button
          variant="default"
          className="w-full text-white font-semibold"
          style={{ backgroundColor: '#b99364' }}
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            // Open portfolio modal
            if (onViewPortfolio) {
              onViewPortfolio(freelancer);
            }
          }}
        >
          <Eye className="h-4 w-4 mr-2" />
          PhotoSync Portfolio
        </Button>

        {/* Contact Button */}
        <Button
          variant="outline"
          className="w-full"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            // Handle contact action
            if (freelancer.email) {
              window.location.href = `mailto:${freelancer.email}`;
            }
          }}
        >
          Contact
        </Button>
      </CardContent>
    </Card>
  );
}

export default memo(FreelancerCard);
