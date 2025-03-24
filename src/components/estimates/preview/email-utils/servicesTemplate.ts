
import { services as serviceOptions } from "../../pages/ServicesPage";

export const generateServicesHtml = (selectedServices: string[] = [], templateId: string = 'modern') => {
  if (selectedServices.length === 0) {
    return '';
  }
  
  // Different styling based on template
  let containerStyle = '';
  let sectionTitleStyle = '';
  let gridStyle = '';
  let serviceCardStyle = '';
  let serviceTitleStyle = '';
  let serviceItemStyle = '';
  let footerStyle = '';
  
  switch(templateId) {
    case 'bold':
      containerStyle = 'margin-bottom:40px; background-color:#f8f8f8; padding:30px;';
      sectionTitleStyle = 'text-align:center; font-size:26px; font-weight:600; margin-bottom:24px; text-transform:uppercase; letter-spacing:1px; color:#333; border-bottom:3px solid #FF719A; padding-bottom:10px; display:inline-block; margin-left:auto; margin-right:auto;';
      gridStyle = 'display:grid; grid-template-columns:1fr 1fr; gap:25px;';
      serviceCardStyle = 'border:none; border-bottom:3px solid #FF719A; padding:24px; background-color:#fff; box-shadow:0 3px 10px rgba(0,0,0,0.1);';
      serviceTitleStyle = 'font-size:20px; font-weight:600; margin-bottom:18px; color:#222; text-transform:uppercase; border-left:3px solid #FF719A; padding-left:12px;';
      serviceItemStyle = 'color:#444; font-size:15px; padding-left:20px; line-height:1.6; margin-bottom:8px; position:relative;';
      footerStyle = 'text-align:center; font-size:14px; color:#555; margin-top:24px; font-weight:500; padding:10px; background-color:#f1f1f1; border-radius:4px;';
      break;
    case 'classic':
      containerStyle = 'margin-bottom:40px; background-color:#fafafa; padding:30px; border:1px solid #e0e0e0;';
      sectionTitleStyle = 'text-align:center; font-size:28px; font-weight:400; margin-bottom:26px; font-family:serif; border-bottom:1px solid #e0e0e0; padding-bottom:15px;';
      gridStyle = 'display:grid; grid-template-columns:1fr 1fr; gap:30px;';
      serviceCardStyle = 'border:1px solid #e0e0e0; padding:24px; background-color:#fff;';
      serviceTitleStyle = 'font-size:22px; font-weight:400; margin-bottom:16px; color:#333; font-family:serif; border-bottom:1px dotted #ccc; padding-bottom:8px;';
      serviceItemStyle = 'color:#555; font-size:15px; padding-left:20px; line-height:1.7; margin-bottom:6px; font-family:serif; font-style:italic;';
      footerStyle = 'text-align:center; font-size:15px; color:#666; margin-top:24px; font-style:italic; font-family:serif; border-top:1px dotted #ccc; padding-top:15px;';
      break;
    case 'modern':
    default:
      containerStyle = 'margin-bottom:30px; background-color:#ffffff; padding:25px; box-shadow:0 2px 10px rgba(0,0,0,0.05); border-radius:8px;';
      sectionTitleStyle = 'text-align:center; font-size:24px; font-weight:300; margin-bottom:25px; color:#3182ce;';
      gridStyle = 'display:grid; grid-template-columns:1fr 1fr; gap:20px;';
      serviceCardStyle = 'border:1px solid #e2e8f0; border-radius:8px; padding:20px; transition:transform 0.2s, box-shadow 0.2s; background-color:#fafafa;';
      serviceTitleStyle = 'font-size:18px; font-weight:500; margin-bottom:15px; color:#3182ce; border-bottom:1px solid #e2e8f0; padding-bottom:8px;';
      serviceItemStyle = 'color:#666; font-size:14px; padding-left:20px; line-height:1.5; margin-bottom:4px;';
      footerStyle = 'text-align:center; font-size:14px; color:#666; margin-top:20px; padding:10px; background-color:#f7fafc; border-radius:4px;';
  }
  
  let servicesHtml = `
    <div style="${containerStyle}">
      <h2 style="${sectionTitleStyle}">SERVICES</h2>
      <div style="${gridStyle}">
  `;
  
  selectedServices.forEach(serviceKey => {
    const service = serviceOptions[serviceKey];
    if (service) {
      servicesHtml += `
        <div style="${serviceCardStyle}">
          <h3 style="${serviceTitleStyle}">${service.title}</h3>
          <ul style="padding-left:0; list-style-position:inside;">
            ${service.items.map(item => `<li style="${serviceItemStyle}">${item}</li>`).join('')}
          </ul>
        </div>
      `;
    }
  });
  
  servicesHtml += `
      </div>
      <div style="${footerStyle}">
        <p>TailorMade - Customised as per clients requirement</p>
      </div>
    </div>
  `;
  
  return servicesHtml;
};
