
// Follow Deno's HTTP server implementation
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TeamMember {
  id: string;
  name: string;
  role: string;
  availability: Record<string, string>;
}

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  photographersCount: number;
  videographersCount: number;
}

interface ScheduleRequest {
  event: Event;
  teamMembers: TeamMember[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { event, teamMembers } = await req.json() as ScheduleRequest;
    
    // Get OpenAI API key from environment variable
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('Missing OpenAI API Key');
    }
    
    console.log('Processing intelligent scheduling for event:', event.name);
    
    // Structure the prompt for OpenAI
    const prompt = `
      As an intelligent scheduling assistant for a photography studio, I need to recommend the best team members for an event.
      
      Event details:
      - Name: ${event.name}
      - Date: ${event.date}
      - Location: ${event.location}
      - Requirements: ${event.photographersCount} photographers and ${event.videographersCount} videographers
      
      Available team members:
      ${teamMembers.map(member => 
        `- ${member.name} (${member.role}): Availability on event date: ${member.availability[event.date] || 'available'}`
      ).join('\n')}
      
      Based on these details, recommend the optimal team assignment that meets the requirements,
      considering only those who are available on the event date.
      Format your response as a JSON array with objects containing teamMemberId and role properties.
      Example: [{"teamMemberId": "id1", "role": "photographer"}, {"teamMemberId": "id2", "role": "videographer"}]
    `;
    
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an intelligent scheduling assistant for a photography studio.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
      }),
    });
    
    const data = await response.json();
    console.log('OpenAI response received');
    
    // Extract the suggestion content
    const suggestionContent = data.choices && data.choices[0] && data.choices[0].message 
      ? data.choices[0].message.content 
      : null;
    
    if (!suggestionContent) {
      console.error('Invalid response from OpenAI:', data);
      throw new Error('Invalid or empty response from OpenAI');
    }
    
    // Try to parse JSON from the response 
    // The AI might include explanatory text, so we need to extract just the JSON part
    let suggestions = [];
    try {
      // Look for JSON array in the response
      const jsonMatch = suggestionContent.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        suggestions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse JSON from response');
      }
    } catch (jsonError) {
      console.error('Error parsing suggestions:', jsonError);
      console.log('Raw response:', suggestionContent);
      
      // Fallback to returning the raw content
      return new Response(JSON.stringify({ 
        rawSuggestion: suggestionContent,
        error: 'Could not parse structured suggestions' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ 
      suggestions,
      rawResponse: suggestionContent
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in intelligent-scheduling function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
