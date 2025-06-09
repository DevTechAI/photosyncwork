
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Plus, Search, MapPin, Camera, Video, Edit, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PostJobForm } from "@/components/hire/PostJobForm";
import { FreelancerCard } from "@/components/hire/FreelancerCard";
import { JobCard } from "@/components/hire/JobCard";

// Mock data for freelancers
const mockFreelancers = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Wedding Photographer",
    location: "New York, NY",
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: "$75-150",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b72944c0?w=150&h=150&fit=crop&crop=face",
    specialties: ["Wedding", "Portrait", "Event"],
    isAvailable: true
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Videographer & Editor",
    location: "Los Angeles, CA",
    rating: 4.8,
    reviewCount: 89,
    hourlyRate: "$80-200",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    specialties: ["Wedding Films", "Corporate", "Music Videos"],
    isAvailable: true
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "Photo Editor",
    location: "Austin, TX",
    rating: 4.9,
    reviewCount: 203,
    hourlyRate: "$40-80",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    specialties: ["Retouching", "Color Grading", "Batch Processing"],
    isAvailable: false
  }
];

// Mock data for job postings
const mockJobs = [
  {
    id: "1",
    title: "Second Shooter for Wedding",
    company: "Elegant Moments Photography",
    location: "Miami, FL",
    type: "Contract",
    budget: "$500-800",
    date: "March 15, 2024",
    description: "Looking for an experienced second shooter for a luxury wedding at The Ritz-Carlton.",
    requirements: ["5+ years experience", "Own equipment", "Portfolio required"],
    postedDate: "2 days ago"
  },
  {
    id: "2", 
    title: "Video Editor for Wedding Films",
    company: "Love Story Productions",
    location: "Remote",
    type: "Freelance",
    budget: "$1,200-2,000",
    date: "Ongoing",
    description: "Seeking a skilled video editor to create cinematic wedding films. Must be proficient in DaVinci Resolve or Premiere Pro.",
    requirements: ["Advanced editing skills", "Color grading experience", "Quick turnaround"],
    postedDate: "1 week ago"
  }
];

export default function Hire() {
  const navigate = useNavigate();
  const [showPostJob, setShowPostJob] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredFreelancers = mockFreelancers.filter(freelancer => {
    const matchesSearch = freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         freelancer.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
                           freelancer.specialties.some(s => s.toLowerCase().includes(selectedCategory));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7f5f2' }}>
      {/* Header */}
      <header className="backdrop-blur-sm shadow-sm border-b border-gray-700/20" style={{ backgroundColor: '#0e0e11' }}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              onClick={() => navigate('/home')} 
              variant="ghost"
              className="text-white hover:bg-gray-800"
            >
              ← Back to Home
            </Button>
            <h1 className="text-2xl font-bold" style={{ color: '#b99364' }}>
              Hire Talent
            </h1>
            <div />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#1a2238' }}>
            Find Your Perfect Creative Partner
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#999999' }}>
            Connect with talented photographers, videographers, and editors to grow your business
          </p>
        </div>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Browse Talent
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Job Board
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or specialty..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: '#b99364', '--tw-ring-color': '#b99364' } as any}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: '#b99364', '--tw-ring-color': '#b99364' } as any}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="wedding">Wedding</option>
                <option value="portrait">Portrait</option>
                <option value="event">Event</option>
                <option value="corporate">Corporate</option>
                <option value="editing">Editing</option>
              </select>
            </div>

            {/* Freelancers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFreelancers.map((freelancer) => (
                <FreelancerCard key={freelancer.id} freelancer={freelancer} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="jobs">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold" style={{ color: '#1a2238' }}>
                Available Opportunities
              </h3>
              <Button 
                onClick={() => setShowPostJob(true)}
                className="text-white"
                style={{ backgroundColor: '#556ee6' }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Post a Job
              </Button>
            </div>

            {/* Job Listings */}
            <div className="space-y-4">
              {mockJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Post Job Modal */}
        {showPostJob && (
          <PostJobForm onClose={() => setShowPostJob(false)} />
        )}
      </main>
    </div>
  );
}
