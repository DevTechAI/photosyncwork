
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember } from "@/components/scheduling/types";

interface AISchedulingSuggestionsProps {
  event: any;  // Event object with details
  teamMembers: TeamMember[];
  onAssign: (teamMemberId: string, role: string) => void;
  availablePhotographers: TeamMember[];
  availableVideographers: TeamMember[];
}

export function AISchedulingSuggestions({
  event,
  teamMembers,
  onAssign,
  availablePhotographers,
  availableVideographers
}: AISchedulingSuggestionsProps) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getAISuggestions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Only include team members that are available
      const availableTeamMembers = teamMembers.filter(member => 
        !member.availability[event.date] || member.availability[event.date] === "available"
      );
      
      const { data, error } = await supabase.functions.invoke('intelligent-scheduling', {
        body: {
          event: {
            id: event.id,
            name: event.name,
            date: event.date,
            location: event.location,
            photographersCount: event.photographersCount,
            videographersCount: event.videographersCount
          },
          teamMembers: availableTeamMembers
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      setSuggestions(data.suggestions || []);
      
      toast({
        title: "AI Suggestions Ready",
        description: "We've generated team assignment suggestions based on availability and event requirements."
      });
      
    } catch (err: any) {
      console.error("Error getting AI suggestions:", err);
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Failed to get AI suggestions",
        description: err.message
      });
    } finally {
      setLoading(false);
    }
  };
  
  const applyAllSuggestions = () => {
    suggestions.forEach(suggestion => {
      const { teamMemberId, role } = suggestion;
      onAssign(teamMemberId, role);
    });
    
    toast({
      title: "Suggestions Applied",
      description: `Applied ${suggestions.length} team assignments.`
    });
    
    setSuggestions([]); // Clear suggestions after applying
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center justify-between">
          <span>AI Scheduling Suggestions</span>
          <Button
            variant="outline"
            size="sm"
            onClick={getAISuggestions}
            disabled={loading}
          >
            {loading ? 
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : 
              'Get AI Suggestions'}
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {error && (
          <div className="bg-destructive/10 p-3 rounded-md flex items-center mb-3">
            <AlertCircle className="h-5 w-5 text-destructive mr-2" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {suggestions.length > 0 ? (
          <div className="space-y-4">
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => {
                const teamMember = teamMembers.find(m => m.id === suggestion.teamMemberId);
                return (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <span className="font-medium">{teamMember?.name || 'Unknown'}</span>
                      <span className="ml-2 text-sm text-muted-foreground capitalize">({suggestion.role})</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onAssign(suggestion.teamMemberId, suggestion.role)}
                    >
                      Assign
                    </Button>
                  </div>
                );
              })}
            </div>
            
            <div className="pt-2 border-t">
              <Button 
                onClick={applyAllSuggestions} 
                className="w-full"
                variant="default"
              >
                Apply All Suggestions
              </Button>
            </div>
          </div>
        ) : !loading && (
          <div className="text-center py-6 text-muted-foreground">
            <p>Click "Get AI Suggestions" to generate team assignments based on availability and event requirements.</p>
          </div>
        )}
        
        {loading && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">Generating intelligent suggestions...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
