
// Follow Deno's HTTP server implementation
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MediaTaggingRequest {
  mediaType: 'image' | 'video';
  mediaUrl: string;
  eventContext?: {
    eventName: string;
    clientName: string;
    eventType?: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mediaType, mediaUrl, eventContext } = await req.json() as MediaTaggingRequest;
    
    // Get OpenAI API key from environment variable
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('Missing OpenAI API Key');
    }
    
    console.log(`Processing ${mediaType} tagging request for URL:`, mediaUrl);
    
    // Structure the prompt for OpenAI based on media type
    let prompt;
    let messages = [];
    
    if (mediaType === 'image') {
      messages = [
        {
          role: 'system',
          content: 'You are an AI assistant specialized in analyzing and tagging photography for a professional studio.'
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this image${eventContext ? ` from ${eventContext.eventName} for client ${eventContext.clientName}` : ''}.
              Provide tags in the following categories:
              1. Visual elements (e.g., outdoor, indoor, portrait, landscape)
              2. Emotional tone (e.g., joyful, solemn, energetic)
              3. Technical aspects (e.g., bokeh, high contrast, shallow depth of field)
              4. People (e.g., bride, groom, family, group)
              5. Composition style (e.g., rule of thirds, symmetrical, leading lines)
              
              Return the response as a JSON object with these categories as keys and arrays of relevant tags as values.
              Example format: {"visual": ["outdoor", "sunset"], "emotional": ["joyful"], ...}`
            },
            {
              type: 'image_url',
              image_url: {
                url: mediaUrl
              }
            }
          ]
        }
      ];
    } else {
      // For video, we can't use the vision API directly, so we'll ask for tags based on the description
      prompt = `
        As a professional video tagging expert for a photography studio${eventContext ? ` analyzing a video from ${eventContext.eventName} for client ${eventContext.clientName}` : ''}, 
        please provide suggested tags for cataloging this video with URL: ${mediaUrl}.
        
        Consider the following categories:
        1. Event type (e.g., wedding ceremony, reception, corporate event)
        2. Emotional tone (e.g., celebratory, formal, intimate)
        3. Technical aspects (e.g., drone shot, slow motion, timelapse)
        4. Key moments (e.g., speeches, first dance, product reveal)
        5. Style (e.g., documentary, cinematic, narrative)
        
        Return the response as a JSON object with these categories as keys and arrays of relevant tags as values.
        Example format: {"eventType": ["wedding ceremony"], "emotional": ["intimate", "romantic"], ...}
      `;
      
      messages = [
        {
          role: 'system',
          content: 'You are an AI assistant specialized in analyzing and tagging videography for a professional studio.'
        },
        {
          role: 'user',
          content: prompt
        }
      ];
    }
    
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: mediaType === 'image' ? 'gpt-4o' : 'gpt-4o-mini', // Use vision model for images
        messages: messages,
        temperature: 0.2,
        max_tokens: 800,
      }),
    });
    
    const data = await response.json();
    console.log('OpenAI response received');
    
    // Extract the tag content
    const tagContent = data.choices[0].message.content;
    
    // Try to parse JSON from the response
    let tags = {};
    try {
      // Look for JSON object in the response
      const jsonMatch = tagContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        tags = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse JSON from response');
      }
    } catch (jsonError) {
      console.error('Error parsing tags:', jsonError);
      console.log('Raw response:', tagContent);
      
      // Fallback to returning the raw content
      return new Response(JSON.stringify({ 
        rawTags: tagContent,
        error: 'Could not parse structured tags' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ 
      tags,
      rawResponse: tagContent
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in media-tagging function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
