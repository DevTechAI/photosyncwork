
import { ReactNode } from "react";
import { services as serviceOptions } from "../pages/ServicesPage";

interface EstimateDetailsProps {
  estimate: {
    id: string;
    clientName: string;
    date: string;
    amount: string;
    status: string;
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
  };
}

export function EstimateDetails({ estimate }: EstimateDetailsProps) {
  const statusClasses = {
    approved: "bg-green-100 text-green-800",
    declined: "bg-red-100 text-red-800",
    negotiating: "bg-yellow-100 text-yellow-800",
    pending: "bg-gray-100 text-gray-800"
  };

  const statusClass = statusClasses[estimate.status] || statusClasses.pending;

  // Check if we have packages data (multiple estimate options)
  const hasPackages = estimate.packages && estimate.packages.length > 0;
  
  // If we don't have packages, use the legacy format (services and deliverables directly on estimate)
  const legacyPackage = {
    name: "Standard Package", // Add a default name for legacy packages
    amount: estimate.amount,
    services: estimate.services || [],
    deliverables: estimate.deliverables || []
  };
  
  // Use packages if available, otherwise create a single package from the estimate's direct properties
  const packagesToRender = hasPackages ? estimate.packages : [legacyPackage];
  
  // Default terms if none provided
  const defaultTerms = [
    "This estimate is valid for 30 days from the date of issue.",
    "A 50% advance payment is required to confirm the booking.",
    "The balance payment is due before the event date."
  ];
  
  // Use provided terms or default terms
  const termsToDisplay = estimate.terms && estimate.terms.length > 0 ? estimate.terms : defaultTerms;

  // Get the selected services
  const selectedServices = estimate.selectedServices || [];

  return (
    <div className="border rounded-lg p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">ESTIMATE</h1>
        <p className="text-muted-foreground">StudioSync Photography Services</p>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${statusClass}`}>
          Status: {estimate.status.charAt(0).toUpperCase() + estimate.status.slice(1)}
        </div>
      </div>

      <div className="flex justify-between items-start border-b pb-4">
        <div>
          <h2 className="font-medium">Client</h2>
          <p>{estimate.clientName}</p>
          <p className="text-sm text-muted-foreground">
            Date: {new Date(estimate.date).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <h2 className="font-medium">Estimate #{estimate.id}</h2>
          <p className="text-sm text-muted-foreground capitalize">
            Valid until: {new Date(new Date(estimate.date).getTime() + 30*24*60*60*1000).toLocaleDateString()}
          </p>
        </div>
      </div>

      {selectedServices.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium mb-2">Selected Services</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {selectedServices.map(serviceKey => (
              <div key={serviceKey} className="border p-4 rounded-md">
                <h4 className="font-medium mb-2">{serviceOptions[serviceKey]?.title}</h4>
                <ul className="list-disc ml-5 space-y-1 text-sm text-muted-foreground">
                  {serviceOptions[serviceKey]?.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {packagesToRender.map((pkg, packageIndex) => (
        <div key={packageIndex} className="border p-4 rounded-md mb-6">
          <h2 className="text-xl font-medium mb-4">
            {hasPackages ? `Package Option ${packageIndex + 1}${pkg.name ? `: ${pkg.name}` : ''}` : 'Package Details'}
          </h2>
          
          {pkg.services && pkg.services.length > 0 && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Services</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Event</th>
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Photographers</th>
                    <th className="text-left py-2">Cinematographers</th>
                  </tr>
                </thead>
                <tbody>
                  {pkg.services.map((service, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{service.event}</td>
                      <td className="py-2">{new Date(service.date).toLocaleDateString()}</td>
                      <td className="py-2">{service.photographers}</td>
                      <td className="py-2">{service.cinematographers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pkg.deliverables && pkg.deliverables.length > 0 && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Deliverables</h3>
              <ul className="list-disc ml-5 space-y-1">
                {pkg.deliverables.map((deliverable, index) => (
                  <li key={index}>{deliverable}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-right pt-2 border-t">
            <span className="font-medium">Package Total: </span>
            <span className="text-xl font-semibold">{pkg.amount}</span>
          </div>
        </div>
      ))}

      <div className="border-t pt-4 text-sm text-muted-foreground">
        <p>Terms & Conditions</p>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          {termsToDisplay.map((term, index) => (
            <li key={index}>{term}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
