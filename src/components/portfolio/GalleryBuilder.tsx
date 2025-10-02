import React, { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Move, 
  RotateCcw, 
  Grid3X3, 
  Layout, 
  Square, 
  Maximize2, 
  Minimize2,
  Save,
  Eye,
  Upload,
  Trash2,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isSelected: boolean;
}

interface GalleryBuilderProps {
  images: GalleryImage[];
  onImagesChange: (images: GalleryImage[]) => void;
  onUploadComplete?: (url: string, fileName: string) => void;
  onRemoveImage?: (id: string) => void;
}

type LayoutMode = 'free' | 'grid' | 'masonry' | 'auto-fit';

export function GalleryBuilder({ 
  images, 
  onImagesChange, 
  onUploadComplete,
  onRemoveImage 
}: GalleryBuilderProps) {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('free');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result) {
            const newImage: GalleryImage = {
              id: `gallery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              url: result,
              title: file.name,
              category: "Uploaded",
              x: Math.random() * 200,
              y: Math.random() * 200,
              width: 200,
              height: 150,
              zIndex: 1,
              isSelected: false
            };

            onImagesChange([...images, newImage]);
            
            if (onUploadComplete) {
              onUploadComplete(result, file.name);
            }

            toast({
              title: "Image uploaded successfully",
              description: `${file.name} has been added to your gallery`
            });
          }
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive"
        });
      }
    });

    // Reset file input
    event.target.value = '';
  };

  // Handle image selection
  const handleImageSelect = (imageId: string) => {
    const updatedImages = images.map(img => ({
      ...img,
      isSelected: img.id === imageId
    }));
    onImagesChange(updatedImages);
    setSelectedImage(imageId);
  };

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent, imageId: string) => {
    e.preventDefault();
    setIsDragging(true);
    setSelectedImage(imageId);
    
    const image = images.find(img => img.id === imageId);
    if (image && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left - image.x,
        y: e.clientY - rect.top - image.y
      });
    }
  };

  // Handle drag move
  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !selectedImage || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;

    const updatedImages = images.map(img => {
      if (img.id === selectedImage) {
        return {
          ...img,
          x: Math.max(0, Math.min(newX, rect.width - img.width)),
          y: Math.max(0, Math.min(newY, rect.height - img.height))
        };
      }
      return img;
    });

    onImagesChange(updatedImages);
  }, [isDragging, selectedImage, dragOffset, images, onImagesChange]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent, imageId: string, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    setSelectedImage(imageId);
  };

  // Handle resize move
  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !selectedImage || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const updatedImages = images.map(img => {
      if (img.id === selectedImage) {
        let newWidth = img.width;
        let newHeight = img.height;
        let newX = img.x;
        let newY = img.y;

        switch (resizeHandle) {
          case 'se': // Southeast
            newWidth = mouseX - img.x;
            newHeight = mouseY - img.y;
            break;
          case 'sw': // Southwest
            newWidth = img.x + img.width - mouseX;
            newHeight = mouseY - img.y;
            newX = mouseX;
            break;
          case 'ne': // Northeast
            newWidth = mouseX - img.x;
            newHeight = img.y + img.height - mouseY;
            newY = mouseY;
            break;
          case 'nw': // Northwest
            newWidth = img.x + img.width - mouseX;
            newHeight = img.y + img.height - mouseY;
            newX = mouseX;
            newY = mouseY;
            break;
        }

        // Maintain aspect ratio and minimum size
        const minSize = 50;
        newWidth = Math.max(minSize, newWidth);
        newHeight = Math.max(minSize, newHeight);

        return {
          ...img,
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight
        };
      }
      return img;
    });

    onImagesChange(updatedImages);
  }, [isResizing, selectedImage, resizeHandle, images, onImagesChange]);

  // Handle resize end
  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    setResizeHandle(null);
  }, []);

  // Auto-fit layout
  const handleAutoFit = () => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;
    const imageCount = images.length;
    
    if (imageCount === 0) return;

    const cols = Math.ceil(Math.sqrt(imageCount));
    const rows = Math.ceil(imageCount / cols);
    const cellWidth = containerWidth / cols;
    const cellHeight = containerHeight / rows;

    const updatedImages = images.map((img, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      return {
        ...img,
        x: col * cellWidth + 10,
        y: row * cellHeight + 10,
        width: cellWidth - 20,
        height: cellHeight - 20
      };
    });

    onImagesChange(updatedImages);
    setLayoutMode('auto-fit');
  };

  // Grid layout
  const handleGridLayout = () => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const cols = 3;
    const cellWidth = (containerWidth - 40) / cols;
    const cellHeight = cellWidth * 0.75; // 4:3 aspect ratio

    const updatedImages = images.map((img, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      return {
        ...img,
        x: col * (cellWidth + 10) + 10,
        y: row * (cellHeight + 10) + 10,
        width: cellWidth,
        height: cellHeight
      };
    });

    onImagesChange(updatedImages);
    setLayoutMode('grid');
  };

  // Masonry layout
  const handleMasonryLayout = () => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const cols = 3;
    const cellWidth = (containerWidth - 40) / cols;
    const columnHeights = new Array(cols).fill(0);

    const updatedImages = images.map((img) => {
      // Find the shortest column
      const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
      
      const x = shortestColumn * (cellWidth + 10) + 10;
      const y = columnHeights[shortestColumn] + 10;
      const height = cellWidth * (0.8 + Math.random() * 0.4); // Random height between 0.8 and 1.2
      
      columnHeights[shortestColumn] += height + 10;
      
      return {
        ...img,
        x,
        y,
        width: cellWidth,
        height
      };
    });

    onImagesChange(updatedImages);
    setLayoutMode('masonry');
  };

  // Reset to free layout
  const handleFreeLayout = () => {
    setLayoutMode('free');
  };

  // Add event listeners for drag and resize
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
    }
    
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [isDragging, isResizing, handleDragMove, handleDragEnd, handleResizeMove, handleResizeEnd]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Gallery Builder
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{layoutMode}</Badge>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={layoutMode === 'free' ? 'default' : 'outline'}
                onClick={handleFreeLayout}
                title="Free Layout"
              >
                <Move className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={layoutMode === 'grid' ? 'default' : 'outline'}
                onClick={handleGridLayout}
                title="Grid Layout"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={layoutMode === 'masonry' ? 'default' : 'outline'}
                onClick={handleMasonryLayout}
                title="Masonry Layout"
              >
                <Square className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={layoutMode === 'auto-fit' ? 'default' : 'outline'}
                onClick={handleAutoFit}
                title="Auto Fit"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Instructions */}
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <p><strong>Instructions:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Click and drag images to reposition them</li>
              <li>Drag the corner handles to resize images</li>
              <li>Use layout buttons to auto-arrange images</li>
              <li>Click on images to select them</li>
            </ul>
          </div>

          {/* Gallery Container */}
          <div
            ref={containerRef}
            className="relative w-full h-96 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
            style={{ minHeight: '400px' }}
          >
            {images.map((image) => (
              <div
                key={image.id}
                className={`absolute cursor-move transition-all duration-200 ${
                  image.isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
                }`}
                style={{
                  left: image.x,
                  top: image.y,
                  width: image.width,
                  height: image.height,
                  zIndex: image.zIndex
                }}
                onMouseDown={(e) => handleDragStart(e, image.id)}
                onClick={() => handleImageSelect(image.id)}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover rounded-lg"
                  draggable={false}
                />
                
                {/* Resize Handles */}
                {image.isSelected && (
                  <>
                    <div
                      className="absolute -top-1 -left-1 w-3 h-3 bg-primary rounded-full cursor-nw-resize"
                      onMouseDown={(e) => handleResizeStart(e, image.id, 'nw')}
                    />
                    <div
                      className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full cursor-ne-resize"
                      onMouseDown={(e) => handleResizeStart(e, image.id, 'ne')}
                    />
                    <div
                      className="absolute -bottom-1 -left-1 w-3 h-3 bg-primary rounded-full cursor-sw-resize"
                      onMouseDown={(e) => handleResizeStart(e, image.id, 'sw')}
                    />
                    <div
                      className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-full cursor-se-resize"
                      onMouseDown={(e) => handleResizeStart(e, image.id, 'se')}
                    />
                  </>
                )}

                {/* Image Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 rounded-b-lg">
                  <p className="text-xs truncate">{image.title}</p>
                  <p className="text-xs opacity-75">{image.category}</p>
                </div>

                {/* Remove Button */}
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onRemoveImage) {
                      onRemoveImage(image.id);
                    }
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}

            {/* Empty State */}
            {images.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <button
                    onClick={() => {
                      const fileInput = document.getElementById('gallery-file-upload') as HTMLInputElement;
                      if (fileInput) {
                        fileInput.click();
                      }
                    }}
                    className="group cursor-pointer transition-all duration-200 hover:scale-105"
                  >
                    <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </button>
                  <button
                    onClick={() => {
                      const fileInput = document.getElementById('gallery-file-upload') as HTMLInputElement;
                      if (fileInput) {
                        fileInput.click();
                      }
                    }}
                    className="text-gray-500 mb-2 hover:text-blue-600 cursor-pointer transition-colors block mx-auto"
                  >
                    No images in gallery
                  </button>
                  <button
                    onClick={() => {
                      const fileInput = document.getElementById('gallery-file-upload') as HTMLInputElement;
                      if (fileInput) {
                        fileInput.click();
                      }
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 underline cursor-pointer transition-colors"
                  >
                    Upload images to start building your gallery
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hidden File Input */}
          <input
            id="gallery-file-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  const fileInput = document.getElementById('gallery-file-upload') as HTMLInputElement;
                  if (fileInput) {
                    fileInput.click();
                  }
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Image
              </Button>
              <Button size="sm" variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Layout
              </Button>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Layout
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
