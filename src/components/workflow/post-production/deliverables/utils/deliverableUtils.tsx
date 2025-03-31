
import React from "react";
import { Camera, Film, FileText, Package, Image, Video, User } from "lucide-react";

export const getDeliverableTypeIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case "photo":
    case "photography":
    case "photos":
      return <Camera className="h-4 w-4 text-blue-500" />;
    case "video":
    case "videography":
    case "videos":
      return <Film className="h-4 w-4 text-purple-500" />;
    case "album":
    case "photobook":
      return <Image className="h-4 w-4 text-indigo-500" />;
    case "edited video":
    case "highlight":
    case "reel":
      return <Video className="h-4 w-4 text-red-500" />;
    case "contract":
    case "document":
      return <FileText className="h-4 w-4 text-gray-500" />;
    case "package":
    case "compilation":
      return <Package className="h-4 w-4 text-green-500" />;
    default:
      return <FileText className="h-4 w-4 text-gray-500" />;
  }
};

export const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "in-progress":
      return "bg-blue-100 text-blue-800";
    case "delivered":
      return "bg-purple-100 text-purple-800";
    case "revision-requested":
      return "bg-amber-100 text-amber-800";
    case "pending":
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getAssigneeInitials = (name: string) => {
  if (!name) return <User className="h-4 w-4" />;
  
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};
