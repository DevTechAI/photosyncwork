
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GalleryHorizontal, Video, Search, Calendar, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GalleryEvent {
  id: string;
  name: string;
  date: string;
  location: string;
  clientName: string;
  photoCount: number;
  videoCount: number;
  thumbnail: string;
}

interface GalleryVideo {
  id: string;
  title: string;
  eventId: string;
  eventName: string;
  duration: string;
  thumbnail: string;
  url: string;
  date: string;
}

// Mock data for demonstration
const mockEvents: GalleryEvent[] = [
  {
    id: "1",
    name: "Sarah & John Wedding",
    date: "2024-03-15",
    location: "Grand Palace Hotel",
    clientName: "Sarah Johnson",
    photoCount: 450,
    videoCount: 3,
    thumbnail: "https://picsum.photos/400/300?random=1"
  },
  {
    id: "2",
    name: "Priya & Arjun Engagement",
    date: "2024-02-28",
    location: "Beach Resort",
    clientName: "Priya Sharma",
    photoCount: 220,
    videoCount: 2,
    thumbnail: "https://picsum.photos/400/300?random=2"
  },
  {
    id: "3",
    name: "Anniversary Celebration",
    date: "2024-01-20",
    location: "Home Garden",
    clientName: "Robert & Maria",
    photoCount: 180,
    videoCount: 1,
    thumbnail: "https://picsum.photos/400/300?random=3"
  }
];

const mockVideos: GalleryVideo[] = [
  {
    id: "1",
    title: "Wedding Ceremony Highlights",
    eventId: "1",
    eventName: "Sarah & John Wedding",
    duration: "5:30",
    thumbnail: "https://picsum.photos/400/300?random=4",
    url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    date: "2024-03-15"
  },
  {
    id: "2",
    title: "Reception Dance",
    eventId: "1",
    eventName: "Sarah & John Wedding",
    duration: "3:45",
    thumbnail: "https://picsum.photos/400/300?random=5",
    url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    date: "2024-03-15"
  },
  {
    id: "3",
    title: "Engagement Ring Exchange",
    eventId: "2",
    eventName: "Priya & Arjun Engagement",
    duration: "2:15",
    thumbnail: "https://picsum.photos/400/300?random=6",
    url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    date: "2024-02-28"
  }
];

export default function Gallery() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"events" | "videos">("events");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [filteredEvents, setFilteredEvents] = useState(mockEvents);
  const [filteredVideos, setFilteredVideos] = useState(mockVideos);

  useEffect(() => {
    // Filter events
    const filtered = mockEvents.filter(event =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);

    // Filter videos
    const filteredVids = mockVideos.filter(video =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.eventName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVideos(filteredVids);
  }, [searchTerm]);

  const handleVideoPlay = (video: GalleryVideo) => {
    navigate(`/video-player/${video.id}`, { state: { video } });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery</h1>
          <p className="text-gray-600">Browse your events and videos</p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={activeTab === "events" ? "default" : "outline"}
              onClick={() => setActiveTab("events")}
              className="flex items-center gap-2"
            >
              <GalleryHorizontal className="h-4 w-4" />
              Events ({filteredEvents.length})
            </Button>
            <Button
              variant={activeTab === "videos" ? "default" : "outline"}
              onClick={() => setActiveTab("videos")}
              className="flex items-center gap-2"
            >
              <Video className="h-4 w-4" />
              Videos ({filteredVideos.length})
            </Button>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="client">Client</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={event.thumbnail}
                    alt={event.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Badge variant="secondary" className="bg-white/90">
                      {event.photoCount} photos
                    </Badge>
                    <Badge variant="secondary" className="bg-white/90">
                      {event.videoCount} videos
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{event.name}</CardTitle>
                  <p className="text-sm text-gray-600">{event.clientName}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" className="flex-1">
                      View Photos
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      View Videos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === "videos" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <Card
                key={video.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleVideoPlay(video)}
              >
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="bg-white/20 rounded-full p-3">
                      <Video className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <Badge variant="secondary" className="bg-black/70 text-white">
                      {video.duration}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2">{video.title}</h3>
                  <p className="text-xs text-gray-600 mb-2">{video.eventName}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(video.date).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {((activeTab === "events" && filteredEvents.length === 0) ||
          (activeTab === "videos" && filteredVideos.length === 0)) && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              {activeTab === "events" ? (
                <GalleryHorizontal className="h-16 w-16 mx-auto" />
              ) : (
                <Video className="h-16 w-16 mx-auto" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {activeTab} found
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? `No ${activeTab} match your search criteria.`
                : `No ${activeTab} available yet.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
