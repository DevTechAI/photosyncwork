
import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, User, Users, ScanFace } from "lucide-react";

interface Person {
  id: string;
  name: string;
  faceCount: number;
  selected: boolean;
}

// Mock recognized people
const mockPeople: Person[] = [
  { id: '1', name: 'Client (Jane)', faceCount: 15, selected: true },
  { id: '2', name: 'Client (John)', faceCount: 12, selected: true },
  { id: '3', name: 'Guest 1', faceCount: 8, selected: false },
  { id: '4', name: 'Guest 2', faceCount: 6, selected: false },
  { id: '5', name: 'Guest 3', faceCount: 4, selected: false },
  { id: '6', name: 'Wedding Party', faceCount: 10, selected: false },
];

export function FaceDetectionDemo() {
  const [people, setPeople] = useState<Person[]>(mockPeople);
  const [scanningMode, setScanningMode] = useState(false);
  
  const handlePersonSelect = (personId: string) => {
    setPeople(people.map(person => 
      person.id === personId 
        ? { ...person, selected: !person.selected } 
        : person
    ));
  };
  
  const toggleScanningMode = () => {
    setScanningMode(!scanningMode);
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <ScanFace className="h-5 w-5 mr-2" />
            Face Recognition
          </CardTitle>
          <Button 
            variant={scanningMode ? "default" : "outline"} 
            size="sm" 
            onClick={toggleScanningMode}
          >
            {scanningMode ? "Scanning..." : "Scan Faces"}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {scanningMode 
            ? "AI is analyzing faces in your photos..." 
            : "Filter photos by recognized people"}
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="people" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="people">
              <User className="h-4 w-4 mr-2" />
              People
            </TabsTrigger>
            <TabsTrigger value="search">
              <Search className="h-4 w-4 mr-2" />
              Find Faces
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="people" className="mt-2">
            <div className="grid grid-cols-2 gap-2">
              {people.map(person => (
                <Button 
                  key={person.id} 
                  variant={person.selected ? "default" : "outline"}
                  className="justify-start h-auto py-2"
                  onClick={() => handlePersonSelect(person.id)}
                >
                  <div className="flex flex-col items-start">
                    <span className="text-sm">{person.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {person.faceCount} photos
                    </span>
                  </div>
                </Button>
              ))}
            </div>
            
            <div className="mt-4 flex">
              <Button variant="outline" size="sm" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="search" className="mt-2">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Active face filters:
              </p>
              <div className="flex flex-wrap gap-2">
                {people
                  .filter(person => person.selected)
                  .map(person => (
                    <Badge key={person.id} variant="outline" className="flex items-center">
                      {person.name}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-4 w-4 ml-1 p-0"
                        onClick={() => handlePersonSelect(person.id)}
                      >
                        ×
                      </Button>
                    </Badge>
                  ))}
                {people.filter(person => person.selected).length === 0 && (
                  <span className="text-sm text-muted-foreground">No filters active</span>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground mt-4">
                {people.filter(person => person.selected).length > 0 
                  ? `Showing photos containing ${people.filter(person => person.selected).map(p => p.name).join(' & ')}`
                  : "Showing all photos"}
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Demo Version:</span> Currently using simulated data. Full implementation would process actual images.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
