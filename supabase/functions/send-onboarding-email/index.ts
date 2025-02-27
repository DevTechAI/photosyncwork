
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@1.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OnboardingEmailRequest {
  to: string;
  clientName: string;
  estimateId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, clientName, estimateId }: OnboardingEmailRequest = await req.json();

    if (!to || !clientName) {
      throw new Error("Email recipient and client name are required");
    }

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    const { data, error } = await resend.emails.send({
      from: "StudioSync <onboarding@resend.dev>",
      to: [to],
      subject: `Welcome to StudioSync - Let's Get Started!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to StudioSync</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .content { background: #f9f9f9; border-radius: 5px; padding: 20px; }
            .next-steps { margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to StudioSync!</h1>
            </div>
            
            <div class="content">
              <p>Dear ${clientName},</p>
              
              <p>Thank you for choosing StudioSync for your photography needs! We're excited to have you onboard and can't wait to create beautiful memories together.</p>
              
              <div class="next-steps">
                <h2>Next Steps:</h2>
                <ol>
                  <li>We'll be sending you an invoice shortly</li>
                  <li>Our team will reach out to schedule a detailed planning session</li>
                  <li>We'll create a customized shot list based on your preferences</li>
                  <li>Final scheduling and coordination will be done</li>
                </ol>
              </div>
              
              <p>Reference Number: ${estimateId}</p>
              
              <p>If you have any questions or concerns, please don't hesitate to reach out to us.</p>
              
              <p>Best regards,<br>The StudioSync Team</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, message: "Onboarding email sent successfully" }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error sending onboarding email:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
