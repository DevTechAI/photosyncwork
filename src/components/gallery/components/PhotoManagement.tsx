
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

interface Photo {
  id: string;
  url: string;
  thumbnail: string;
  selected: boolean;
  favorite: boolean;
}

interface PhotoManagementProps {
  photos: Photo[];
}

export function PhotoManagement({ photos }: PhotoManagementProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Photo Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {photos.map(photo => (
            <div key={photo.id} className="relative group">
              <img 
                src={photo.thumbnail} 
                alt="Gallery photo" 
                className="w-full h-32 object-cover rounded-lg" 
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 rounded-lg" />
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-1">
                {photo.selected && (
                  <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                    Selected
                  </span>
                )}
                {photo.favorite && (
                  <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                    ♥
                  </span>
                )}
              </div>
            </div>
          ))}
          
          <div className="border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center h-32 cursor-pointer hover:bg-gray-50">
            <div className="text-center">
              <PlusCircle className="h-6 w-6 mx-auto text-gray-400" />
              <p className="text-xs text-gray-400 mt-1">Add Photos</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 border-t pt-4">
          <h3 className="text-sm font-medium mb-2">Client Selections</h3>
          <p className="text-sm text-muted-foreground">
            {photos.filter(p => p.selected).length} of {photos.length} photos selected by client
          </p>
          
          <h3 className="text-sm font-medium mt-4 mb-2">Client Favorites</h3>
          <p className="text-sm text-muted-foreground">
            {photos.filter(p => p.favorite).length} of {photos.length} photos marked as favorites
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
