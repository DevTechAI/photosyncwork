
import { services as serviceOptions } from "../../pages/ServicesPage";

export const generateServicesHtml = (selectedServices: string[] = []) => {
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
