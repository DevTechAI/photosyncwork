
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EstimateEmailRequest {
  to: string;
  clientName: string;
  estimateId: string;
  amount: string;
  selectedServices?: string[];
  services?: any[];
  deliverables?: string[];
  packages?: any[];
  terms?: string[];
  completeHtml: string; // Added to receive the complete HTML from the client
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const emailData: EstimateEmailRequest = await req.json();
    
    // Validate the email address
    if (!emailData.to || !emailData.to.includes('@')) {
      throw new Error('Invalid recipient email address');
    }

    console.log("Sending email to:", emailData.to);

    // Use the complete HTML provided by the client
    const emailResponse = await resend.emails.send({
      from: "StudioSync <onboarding@resend.dev>",
      to: [emailData.to],
      subject: `Estimate #${emailData.estimateId} for ${emailData.clientName}`,
      html: emailData.completeHtml,
      // Adding some additional configurations to help with deliverability
      reply_to: "noreply@studiosync.app",
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-estimate-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
