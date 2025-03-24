
interface EmailData {
  to: string;
  clientName: string;
  estimateId: string;
  amount: string;
  selectedServices?: string[];
  services?: any[];
  deliverables?: string[];
  packages?: any[];
  terms?: string[];
  portfolioLinks?: any[];
  selectedTemplate?: string;
  completeHtml: string;
}

export const sendEmailFallback = async (emailData: EmailData) => {
  console.log("Using email fallback mechanism with data:", emailData);
  
  const pendingEmails = JSON.parse(localStorage.getItem("pendingEmails") || "[]");
  pendingEmails.push({
    ...emailData,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem("pendingEmails", JSON.stringify(pendingEmails));
  
  return { success: true, fallback: true };
};
