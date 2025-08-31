import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Plus, Search, MapPin, Calendar, DollarSign, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PostJobForm } from "@/components/hire/PostJobForm";
import FreelancerCard from "@/components/hire/FreelancerCard";
import JobCard from "@/components/hire/JobCard";
import { useHireData } from "@/hooks/hire/useHireData";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Hire() {
  const navigate = useNavigate();
  const { 
    freelancers, 
    jobs, 
    isLoadingFreelancers, 
    isLoadingJobs,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    showPostJob,
    setShowPostJob
  } = useHireData();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7f5f2' }}>
      {/* Header */}
      <header className="backdrop-blur-sm shadow-sm border-b border-gray-700/20" style={{ backgroundColor: '#0e0e11' }}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              onClick={() => navigate('/')} 
              variant="ghost"
              className="text-white hover:bg-gray-800"
            >
              ← Back to Home
            </Button>
            <h1 className="text-2xl font-bold" style={{ color: '#b99364' }}>
              Hire Talent
            </h1>
            <Button 
              onClick={() => navigate('/portfolio')} 
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-black"
            >
              Create Portfolio
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#1a2238' }}>
            Find Your Perfect Creative Partner
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-6" style={{ color: '#999999' }}>
            Connect with talented photographers, videographers, and editors to grow your business
          </p>
          <Card className="max-w-md mx-auto p-4 bg-blue-50 border-blue-200">
            <CardContent className="pt-0">
              <h3 className="font-semibold text-blue-900 mb-2">Are you a photographer?</h3>
              <p className="text-sm text-blue-700 mb-3">
                Create your professional portfolio to showcase your work and get hired by clients.
              </p>
              <Button 
                onClick={() => navigate('/portfolio')}
                className="w-full"
                style={{ backgroundColor: '#556ee6' }}
              >
                Create Your Portfolio
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Browse Talent
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Job Board
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name or specialty..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: '#b99364', '--tw-ring-color': '#b99364' } as any}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-auto">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="wedding">Wedding</SelectItem>
                  <SelectItem value="portrait">Portrait</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="editing">Editing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Freelancers Grid */}
            {isLoadingFreelancers ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-64 w-full" />
                ))}
              </div>
            ) : freelancers.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <Users className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No freelancers found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {freelancers.map((freelancer) => (
                  <FreelancerCard key={freelancer.id} freelancer={freelancer} />
                ))}
              </div>
            )}
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
            {isLoadingJobs ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No job postings yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Be the first to post a job opportunity
                </p>
                <Button 
                  onClick={() => setShowPostJob(true)}
                  className="text-white"
                  style={{ backgroundColor: '#556ee6' }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Post a Job
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
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