import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Camera, MapPin, DollarSign, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface FreelancerProfileFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function FreelancerProfileForm({ onSuccess, onCancel }: FreelancerProfileFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [specialties, setSpecialties] = useState<string[]>(['Photography']);
  const [newSpecialty, setNewSpecialty] = useState('');

  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || '',
    role: 'photographer',
    location: '',
    hourlyRate: '$50-100/hour',
    bio: '',
    email: user?.email || '',
    phone: '',
    website: '',
    linkedin: '',
    instagram: '',
    experienceYears: 0
  });

  const roleOptions = [
    { value: 'photographer', label: 'Photographer' },
    { value: 'videographer', label: 'Videographer' },
    { value: 'editor', label: 'Photo/Video Editor' },
    { value: 'retoucher', label: 'Retoucher' },
    { value: 'cinematographer', label: 'Cinematographer' }
  ];

  const hourlyRateOptions = [
    '$25-50/hour',
    '$50-100/hour',
    '$100-200/hour',
    '$200+/hour',
    'Project-based'
  ];

  const commonSpecialties = [
    'Photography', 'Portrait', 'Wedding', 'Event', 'Commercial',
    'Videography', 'Cinematography', 'Photo Editing', 'Video Editing',
    'Retouching', 'Color Grading', 'Drone', 'Fashion', 'Product',
    'Real Estate', 'Food', 'Sports', 'Documentary'
  ];

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties(prev => [...prev, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setSpecialties(prev => prev.filter(s => s !== specialty));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('freelancers')
        .insert([{
          user_id: user?.id,
          name: formData.name,
          role: formData.role,
          location: formData.location,
          hourly_rate: formData.hourlyRate,
          bio: formData.bio,
          email: formData.email,
          phone: formData.phone,
          website: formData.website,
          linkedin: formData.linkedin,
          instagram: formData.instagram,
          experience_years: formData.experienceYears,
          specialties: specialties,
          is_available: true,
          enlist_status: 'enlisted',
          rating: 0.0,
          review_count: 0,
          avatar: '/photosyncwork-logo.png'
        }]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You are now a freelancer! Your profile has been created successfully.",
      });

      onSuccess?.();
    } catch (error: any) {
      console.error('Error creating freelancer profile:', error);
      toast({
        title: "Error",
        description: "Failed to become a freelancer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Become a Freelancer
        </CardTitle>
        <CardDescription>
          Set up your professional profile to start getting hired for photography and creative projects.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, State/Country"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Hourly Rate *</Label>
              <Select value={formData.hourlyRate} onValueChange={(value) => handleInputChange('hourlyRate', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rate range" />
                </SelectTrigger>
                <SelectContent>
                  {hourlyRateOptions.map((rate) => (
                    <SelectItem key={rate} value={rate}>
                      {rate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="linkedin">Portfolio</Label>
                <a 
                  href="/portfolio" 
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Create
                </a>
              </div>
              <Input
                id="linkedin"
                value={formData.linkedin}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                placeholder="yourportfolio.com or portfolio link"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={formData.instagram}
                onChange={(e) => handleInputChange('instagram', e.target.value)}
                placeholder="@yourusername"
              />
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label htmlFor="experienceYears">Years of Experience</Label>
            <Input
              id="experienceYears"
              type="number"
              min="0"
              max="50"
              value={formData.experienceYears}
              onChange={(e) => handleInputChange('experienceYears', parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>

          {/* Specialties */}
          <div className="space-y-2">
            <Label>Specialties *</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {specialties.map((specialty) => (
                <Badge key={specialty} variant="secondary" className="flex items-center gap-1">
                  {specialty}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeSpecialty(specialty)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Select value={newSpecialty} onValueChange={setNewSpecialty}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Add specialty" />
                </SelectTrigger>
                <SelectContent>
                  {commonSpecialties
                    .filter(s => !specialties.includes(s))
                    .map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button type="button" onClick={addSpecialty} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell potential clients about yourself, your style, and what makes you unique..."
              rows={4}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Becoming Freelancer...' : 'Become Freelancer'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
