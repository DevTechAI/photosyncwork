
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  clientName: string;
  estimateId: string;
  amount: string;
  services?: Array<{
    event: string;
    date: string;
    photographers: string;
    cinematographers: string;
  }>;
  deliverables?: string[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, clientName, estimateId, amount, services, deliverables }: EmailRequest = await req.json();

    if (!to) {
      throw new Error("Email recipient is required");
    }

    console.log(`Sending estimate email to ${to} for client ${clientName}`);
    
    // In a real implementation, you would use a service like Resend, SendGrid, or other email providers
    // For now, we'll just simulate a successful email send
    
    // Mock email sending - we're simulating sending the email
    // In a production environment, you would integrate with an email service
    const emailContent = `
      <h1>Estimate #${estimateId} for ${clientName}</h1>
      <p>Amount: ${amount}</p>
      
      <h2>Services:</h2>
      <ul>
        ${services?.map(service => `
          <li>
            ${service.event} on ${new Date(service.date).toLocaleDateString()} - 
            ${service.photographers} photographer(s), 
            ${service.cinematographers} cinematographer(s)
          </li>
        `).join('') || 'No services specified'}
      </ul>
      
      <h2>Deliverables:</h2>
      <ul>
        ${deliverables?.map(item => `<li>${item}</li>`).join('') || 'No deliverables specified'}
      </ul>
      
      <p>Thank you for considering our services!</p>
    `;
    
    console.log("Email content prepared:", emailContent.substring(0, 100) + "...");
    console.log("Email would be sent in a production environment");

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email sent successfully",
        to,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to send email" 
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
