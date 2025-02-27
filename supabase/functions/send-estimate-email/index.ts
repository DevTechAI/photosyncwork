
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@1.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  try {
    // Handle sending estimate email
    const { to, clientName, estimateId, amount, services, deliverables }: EmailRequest = await req.json();

    if (!to) {
      throw new Error("Email recipient is required");
    }

    console.log(`Sending estimate email to ${to} for client ${clientName}`);
    
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    
    if (!Deno.env.get("RESEND_API_KEY")) {
      throw new Error("RESEND_API_KEY is not set in environment variables");
    }
    
    // Format services and deliverables for email
    const servicesHTML = services && services.length > 0
      ? `
        <h2 style="color: #333; margin-top: 20px;">Services:</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #ddd;">
            <th style="text-align: left; padding: 8px;">Event</th>
            <th style="text-align: left; padding: 8px;">Date</th>
            <th style="text-align: left; padding: 8px;">Photographers</th>
            <th style="text-align: left; padding: 8px;">Cinematographers</th>
          </tr>
          ${services.map(service => `
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 8px;">${service.event}</td>
              <td style="padding: 8px;">${new Date(service.date).toLocaleDateString()}</td>
              <td style="padding: 8px;">${service.photographers}</td>
              <td style="padding: 8px;">${service.cinematographers}</td>
            </tr>
          `).join('')}
        </table>
      `
      : '<p>No services specified</p>';
    
    const deliverablesHTML = deliverables && deliverables.length > 0
      ? `
        <h2 style="color: #333; margin-top: 20px;">Deliverables:</h2>
        <ul>
          ${deliverables.map(item => `<li>${item}</li>`).join('')}
        </ul>
      `
      : '<p>No deliverables specified</p>';

    // Create email HTML template WITHOUT approve/decline buttons
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Estimate for ${clientName}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { color: #2c3e50; margin: 0; }
          .header p { color: #7f8c8d; margin: 5px 0 0; }
          .content { background: #f9f9f9; border-radius: 5px; padding: 20px; }
          .footer { margin-top: 30px; font-size: 12px; color: #7f8c8d; text-align: center; }
          .amount { font-size: 24px; font-weight: bold; margin: 20px 0; text-align: right; }
          .terms { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
          .contact-us {
            margin-top: 20px;
            padding: 15px;
            background-color: #f8fafc;
            border-radius: 5px;
            text-align: center;
          }
          .contact-us p {
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ESTIMATE #${estimateId}</h1>
            <p>StudioSync Photography Services</p>
          </div>
          
          <div class="content">
            <p>Dear ${clientName},</p>
            
            <p>Thank you for your interest in our photography services. Please find your estimate details below:</p>
            
            ${servicesHTML}
            
            ${deliverablesHTML}
            
            <div class="amount">
              Total Amount: ${amount}
            </div>
            
            <div class="contact-us">
              <p><strong>Have questions or need to discuss?</strong></p>
              <p>Call us: <a href="tel:+1234567890">+1 (234) 567-890</a></p>
              <p>Email: <a href="mailto:contact@studiosync.com">contact@studiosync.com</a></p>
            </div>
            
            <div class="terms">
              <p><strong>Terms & Conditions:</strong></p>
              <ul>
                <li>This estimate is valid for 30 days from the date of issue.</li>
                <li>A 50% advance payment is required to confirm the booking.</li>
                <li>The balance payment is due before the event date.</li>
                <li>By accepting this estimate, you agree to our terms and conditions.</li>
              </ul>
            </div>
          </div>
          
          <div class="footer">
            <p>For any queries, please don't hesitate to contact us.</p>
            <p>© ${new Date().getFullYear()} StudioSync Photography</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    console.log("Sending email with Resend...");
    
    // Send the email using Resend
    const { data, error: resendError } = await resend.emails.send({
      from: "StudioSync Estimates <onboarding@resend.dev>",
      to: [to],
      subject: `Estimate #${estimateId} for ${clientName}`,
      html: emailHTML,
    });
    
    if (resendError) {
      console.error("Resend API error:", resendError);
      throw new Error(`Failed to send email: ${resendError.message || "Unknown error"}`);
    }
    
    console.log("Email sent successfully:", data);

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email sent successfully",
        to,
        emailId: data?.id,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    
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
