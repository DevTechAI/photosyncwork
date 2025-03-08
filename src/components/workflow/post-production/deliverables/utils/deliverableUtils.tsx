
import { Camera, Film, Book } from "lucide-react";
import React from "react";

export const getDeliverableTypeIcon = (type: string) => {
  switch (type) {
    case "photos":
      return <Camera className="h-4 w-4" />;
    case "videos":
      return <Film className="h-4 w-4" />;
    case "album":
      return <Book className="h-4 w-4" />;
    default:
      return <Camera className="h-4 w-4" />;
  }
};

export const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-gray-100 text-gray-800";
    case "in-progress":
      return "bg-blue-100 text-blue-800";
    case "delivered":
      return "bg-yellow-100 text-yellow-800";
    case "revision-requested":
      return "bg-orange-100 text-orange-800";
    case "completed":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
