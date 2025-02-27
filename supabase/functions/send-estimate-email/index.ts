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
    if (url.searchParams.has('accept')) {
      const estimateId = url.searchParams.get('estimateId');
      const token = url.searchParams.get('token');
      
      if (!estimateId || !token) {
        throw new Error("Invalid acceptance link");
      }

      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        { auth: { persistSession: false } }
      );

      const { data, error } = await supabase
        .from('estimates')
        .update({ status: 'approved' })
        .eq('id', estimateId)
        .select();

      if (error) throw error;

      const successHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Estimate Accepted</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; text-align: center; margin-top: 50px; }
              .success { color: #0f766e; font-size: 24px; margin-bottom: 20px; }
              .message { color: #334155; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="success">✓ Estimate Accepted Successfully</div>
            <div class="message">
              Thank you for accepting the estimate. We will be in touch shortly to discuss the next steps.
            </div>
          </body>
        </html>
      `;

      return new Response(successHtml, {
        headers: { ...corsHeaders, "Content-Type": "text/html" },
      });
    }

    const { to, clientName, estimateId, amount, services, deliverables }: EmailRequest = await req.json();

    if (!to) {
      throw new Error("Email recipient is required");
    }

    console.log(`Sending estimate email to ${to} for client ${clientName}`);
    
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    
    if (!Deno.env.get("RESEND_API_KEY")) {
      throw new Error("RESEND_API_KEY is not set in environment variables");
    }

    const acceptanceToken = crypto.randomUUID();
    const acceptanceLink = `${baseUrl}?accept=true&estimateId=${estimateId}&token=${acceptanceToken}`;
    
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
          .accept-button {
            display: block;
            width: 200px;
            margin: 30px auto;
            padding: 15px 25px;
            background-color: #0f766e;
            color: white;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
          }
          .accept-button:hover {
            background-color: #0d6d64;
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
            
            <a href="${acceptanceLink}" class="accept-button">
              Accept Estimate
            </a>
            
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
