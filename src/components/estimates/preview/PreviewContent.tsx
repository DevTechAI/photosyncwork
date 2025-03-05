
import { WelcomePage } from "../pages/WelcomePage";
import { ServicesPage } from "../pages/ServicesPage";
import { EstimateDetails } from "./EstimateDetails";

interface PreviewContentProps {
  currentPageIndex: number;
  estimate: any;
}

export function PreviewContent({ currentPageIndex, estimate }: PreviewContentProps) {
  // Ensure selectedServices is always an array
  const selectedServices = estimate?.selectedServices || [];

  const pages = [
    <WelcomePage 
      key="welcome" 
      clientName={estimate.clientName}
      clientEmail={estimate.clientEmail || ""}
      onClientNameChange={() => {}} // No-op function since this is read-only
      onClientEmailChange={() => {}} // No-op function since this is read-only
      isReadOnly={true}
    />,
    <ServicesPage 
      key="services"
      selectedServices={selectedServices}
      onServicesChange={() => {}} // No-op function since this is read-only
      isReadOnly={true}
    />,
    <EstimateDetails 
      key="details"
      estimate={estimate} 
    />
  ];

  return pages[currentPageIndex] || null;
}
