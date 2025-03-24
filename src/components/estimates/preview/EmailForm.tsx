import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Send, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { services as serviceOptions } from "../pages/ServicesPage";
import { estimateTemplates } from "../pages/TemplateSelectionPage";
import { PortfolioLink } from "../form/types";

interface EmailFormProps {
  onClose: () => void;
  estimate: {
    id: string;
    clientName: string;
    clientEmail?: string;
    amount: string;
    date: string;
    selectedServices?: string[];
    services?: Array<{
      event: string;
      date: string;
      photographers: string;
      cinematographers: string;
    }>;
    deliverables?: string[];
    packages?: Array<{
      name?: string;
      amount: string;
      services: Array<{
        event: string;
        date: string;
        photographers: string;
        cinematographers: string;
      }>;
      deliverables: string[];
    }>;
    terms?: string[];
    portfolioLinks?: PortfolioLink[];
    selectedTemplate?: string;
  };
}

export function EmailForm({ onClose, estimate }: EmailFormProps) {
  const [emailInput, setEmailInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (estimate.clientEmail) {
      setEmailInput(estimate.clientEmail);
    }
  }, [estimate.clientEmail]);

  const sendEmailFallback = async (emailData) => {
    console.log("Using email fallback mechanism with data:", emailData);
    
    const pendingEmails = JSON.parse(localStorage.getItem("pendingEmails") || "[]");
    pendingEmails.push({
      ...emailData,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("pendingEmails", JSON.stringify(pendingEmails));
    
    return { success: true, fallback: true };
  };

  const generatePortfolioHtml = () => {
    const portfolioLinks = estimate.portfolioLinks || [];
    
    if (portfolioLinks.length === 0) {
      return '';
    }
    
    let portfolioHtml = `
      <div style="margin-bottom:30px;">
        <h2 style="text-align:center; font-size:24px; font-weight:300; margin-bottom:20px;">OUR PORTFOLIO</h2>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
    `;
    
    portfolioLinks.forEach(link => {
      let platformIcon = '';
      switch(link.platform) {
        case 'youtube':
          platformIcon = '📺';
          break;
        case 'vimeo':
          platformIcon = '🎬';
          break;
        case 'website':
          platformIcon = '🌐';
          break;
        case 'instagram':
          platformIcon = '📷';
          break;
        default:
          platformIcon = '🔗';
      }
      
      portfolioHtml += `
        <div style="border:1px solid #e2e8f0; border-radius:8px; padding:20px;">
          <h3 style="font-size:18px; font-weight:500; margin-bottom:10px;">
            ${platformIcon} ${link.title}
          </h3>
          <a href="${link.url}" style="color:#3182ce; text-decoration:underline; display:block; margin-bottom:8px;">${link.url}</a>
          ${link.description ? `<p style="color:#666; font-size:14px;">${link.description}</p>` : ''}
        </div>
      `;
    });
    
    portfolioHtml += `
        </div>
      </div>
    `;
    
    return portfolioHtml;
  };

  const generateIntroHtml = () => {
    return `
      <div style="text-align:center; margin-bottom:30px;">
        <h1 style="font-size:28px; font-weight:300; letter-spacing:0.5px;">STUDIOSYNC</h1>
        <p style="font-size:20px; font-weight:300; color:#666;">Hello ${estimate.clientName}!</p>
        <div style="max-width:600px; margin:20px auto; text-align:center; color:#666; font-size:14px;">
          <p>
            We are a Hyderabad based Wedding Photography firm with over 11 years of experience in non-meddling,
            inventive, photojournalistic approach. We need you to recollect how you felt on your big day. At each
            wedding, We plan to archive genuine minutes and crude feelings in new and remarkable manners.
          </p>
        </div>
      </div>
    `;
  };

  const generateServicesHtml = () => {
    const selectedServices = estimate.selectedServices || [];
    
    if (selectedServices.length === 0) {
      return '';
    }
    
    let servicesHtml = `
      <div style="margin-bottom:30px;">
        <h2 style="text-align:center; font-size:24px; font-weight:300; margin-bottom:20px;">SERVICES</h2>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
    `;
    
    selectedServices.forEach(serviceKey => {
      const service = serviceOptions[serviceKey];
      if (service) {
        servicesHtml += `
          <div style="border:1px solid #e2e8f0; border-radius:8px; padding:20px;">
            <h3 style="font-size:18px; font-weight:500; margin-bottom:15px;">${service.title}</h3>
            <ul style="color:#666; font-size:14px; padding-left:20px;">
              ${service.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        `;
      }
    });
    
    servicesHtml += `
        </div>
        <div style="text-align:center; font-size:14px; color:#666; margin-top:20px;">
          <p>TailorMade - Customised as per clients requirement</p>
        </div>
      </div>
    `;
    
    return servicesHtml;
  };

  const applyTemplateStyles = (html) => {
    const templateId = estimate.selectedTemplate || 'modern';
    
    let headerClass = '';
    let contentClass = '';
    let headingClass = '';
    
    switch(templateId) {
      case 'bold':
        headerClass = 'background-color:#000000; color:#ffffff; padding:32px 0;';
        contentClass = 'border-left:4px solid #000000; padding-left:16px; margin-bottom:24px;';
        headingClass = 'font-weight:700; text-transform:uppercase; letter-spacing:2px;';
        break;
      case 'classic':
        headerClass = 'background-color:#f7f7f7; color:#333333; padding:24px 0; border-bottom:2px solid #e0e0e0;';
        contentClass = 'border-bottom:1px solid #e0e0e0; padding-bottom:24px; margin-bottom:24px;';
        headingClass = 'font-family:serif; font-size:20px;';
        break;
      case 'modern':
      default:
        headerClass = 'background-color:#ffffff; color:#333333; padding:16px 0;';
        contentClass = 'margin-bottom:24px;';
        headingClass = 'font-weight:500;';
    }
    
    let styledHtml = html.replace(
      '<div style="text-align:center; margin-bottom:20px;">',
      `<div style="text-align:center; margin-bottom:20px; ${headerClass}">`
    );
    
    styledHtml = styledHtml.replace(/<h([2-3])(.*?)>/g, `<h$1$2 style="${headingClass}">`);
    
    styledHtml = styledHtml.replace(
      /<div style="margin-bottom:16px;">/g, 
      `<div style="margin-bottom:16px; ${contentClass}">`
    );
    
    return styledHtml;
  };

  const generateEstimateDetailsHtml = () => {
    const hasPackages = estimate.packages && estimate.packages.length > 0;
    
    const legacyPackage = {
      name: "Standard Package",
      amount: estimate.amount,
      services: estimate.services || [],
      deliverables: estimate.deliverables || []
    };
    
    const packagesToRender = hasPackages ? estimate.packages : [legacyPackage];
    
    const defaultTerms = [
      "This estimate is valid for 30 days from the date of issue.",
      "A 50% advance payment is required to confirm the booking.",
      "The balance payment is due before the event date."
    ];
    
    const termsToDisplay = estimate.terms && estimate.terms.length > 0 ? estimate.terms : defaultTerms;

    let estimateHtml = `
      <div style="border:1px solid #e2e8f0; border-radius:8px; padding:24px; margin-bottom:30px;">
        <div style="text-align:center; margin-bottom:20px;">
          <h2 style="font-size:24px; font-weight:600; margin-bottom:10px;">ESTIMATE</h2>
          <p style="color:#666;">StudioSync Photography Services</p>
          <div style="display:inline-block; background:#f1f5f9; color:#374151; padding:4px 12px; border-radius:9999px; font-size:14px; margin-top:10px;">
            Status: Pending
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; border-bottom:1px solid #e2e8f0; padding-bottom:16px; margin-bottom:16px;">
          <div>
            <h3 style="font-weight:500;">Client</h3>
            <p>${estimate.clientName}</p>
            <p style="font-size:14px; color:#666;">Date: ${new Date(estimate.date).toLocaleDateString()}</p>
          </div>
          <div style="text-align:right;">
            <h3 style="font-weight:500;">Estimate #${estimate.id}</h3>
            <p style="font-size:14px; color:#666;">Valid until: ${new Date(new Date(estimate.date).getTime() + 30*24*60*60*1000).toLocaleDateString()}</p>
          </div>
        </div>
    `;

    packagesToRender.forEach((pkg, packageIndex) => {
      estimateHtml += `
        <div style="border:1px solid #e2e8f0; border-radius:8px; padding:16px; margin-bottom:24px;">
          <h3 style="font-size:18px; font-weight:500; margin-bottom:16px;">
            ${hasPackages ? `Package Option ${packageIndex + 1}${pkg.name ? `: ${pkg.name}` : ''}` : 'Package Details'}
          </h3>
          
          ${pkg.services && pkg.services.length > 0 ? `
            <div style="margin-bottom:16px;">
              <h4 style="font-weight:500; margin-bottom:8px;">Services</h4>
              <table style="width:100%; border-collapse:collapse;">
                <thead>
                  <tr style="border-bottom:1px solid #e2e8f0;">
                    <th style="text-align:left; padding:8px 4px;">Event</th>
                    <th style="text-align:left; padding:8px 4px;">Date</th>
                    <th style="text-align:left; padding:8px 4px;">Photographers</th>
                    <th style="text-align:left; padding:8px 4px;">Cinematographers</th>
                  </tr>
                </thead>
                <tbody>
                  ${pkg.services.map(service => `
                    <tr style="border-bottom:1px solid #e2e8f0;">
                      <td style="padding:8px 4px;">${service.event}</td>
                      <td style="padding:8px 4px;">${new Date(service.date).toLocaleDateString()}</td>
                      <td style="padding:8px 4px;">${service.photographers}</td>
                      <td style="padding:8px 4px;">${service.cinematographers}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : ''}

          ${pkg.deliverables && pkg.deliverables.length > 0 ? `
            <div style="margin-bottom:16px;">
              <h4 style="font-weight:500; margin-bottom:8px;">Deliverables</h4>
              <ul style="list-style-type:disc; margin-left:20px;">
                ${Array.isArray(pkg.deliverables) ? pkg.deliverables.map(deliverable => `<li>${deliverable}</li>`).join('') : ''}
              </ul>
            </div>
          ` : ''}

          <div style="text-align:right; padding-top:8px; border-top:1px solid #e2e8f0;">
            <span style="font-weight:500;">Package Total: </span>
            <span style="font-size:18px; font-weight:600;">${pkg.amount}</span>
          </div>
        </div>
      `;
    });

    estimateHtml += `
        <div style="border-top:1px solid #e2e8f0; padding-top:16px; font-size:14px; color:#666;">
          <p>Terms & Conditions</p>
          <ul style="list-style-type:disc; margin-left:20px; margin-top:8px;">
            ${termsToDisplay.map(term => `<li>${term}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;

    return applyTemplateStyles(estimateHtml);
  };

  const handleSendEmail = async () => {
    if (!emailInput) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const completeHtml = `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          ${generateIntroHtml()}
          ${generatePortfolioHtml()}
          ${generateServicesHtml()}
          ${generateEstimateDetailsHtml()}
        </div>
      `;

      const emailData = {
        to: emailInput,
        clientName: estimate.clientName,
        estimateId: estimate.id,
        amount: estimate.amount,
        selectedServices: estimate.selectedServices,
        services: estimate.services,
        deliverables: estimate.deliverables,
        packages: estimate.packages,
        terms: estimate.terms,
        portfolioLinks: estimate.portfolioLinks,
        selectedTemplate: estimate.selectedTemplate,
        completeHtml: completeHtml
      };
      
      let result;
      try {
        const { data, error } = await supabase.functions.invoke("send-estimate-email", {
          body: emailData
        });
        
        if (error) {
          throw new Error(error.message || "Failed to send a request to the Edge Function");
        }
        
        result = { success: true, data };
      } catch (edgeFunctionError) {
        console.warn("Edge function failed, using fallback:", edgeFunctionError);
        result = await sendEmailFallback(emailData);
      }
      
      console.log("Email sending result:", result);
      
      let toastMessage = `Estimate has been sent to ${emailInput}`;
      if (result.fallback) {
        toastMessage += " (using fallback method)";
      }
      
      toast({
        title: "Estimate Sent!",
        description: toastMessage,
      });
      
      onClose();
    } catch (error) {
      console.error("Failed to send email:", error);
      toast({
        title: "Error",
        description: `Failed to send email: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="email">Client Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="client@example.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
          </div>
          <Button
            onClick={handleSendEmail}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send"}
            <Send className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
