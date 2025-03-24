
import { PortfolioLink } from "../../form/types";

export const generatePortfolioHtml = (portfolioLinks: PortfolioLink[] = [], templateId: string = 'modern') => {
  if (portfolioLinks.length === 0) {
    return '';
  }
  
  // Different styling based on template
  let sectionTitleStyle = '';
  let cardStyle = '';
  let titleStyle = '';
  let linkStyle = '';
  let descStyle = '';
  
  switch(templateId) {
    case 'bold':
      sectionTitleStyle = 'text-align:center; font-size:26px; font-weight:600; margin-bottom:24px; text-transform:uppercase; letter-spacing:1px;';
      cardStyle = 'border:none; border-bottom:3px solid #FF719A; border-radius:0px; padding:24px; background-color:#f8f8f8;';
      titleStyle = 'font-size:20px; font-weight:600; margin-bottom:16px; color:#222; text-transform:uppercase;';
      linkStyle = 'color:#FF719A; text-decoration:none; display:block; margin-bottom:12px; font-weight:500;';
      descStyle = 'color:#444; font-size:15px; line-height:1.5;';
      break;
    case 'classic':
      sectionTitleStyle = 'text-align:center; font-size:28px; font-weight:400; margin-bottom:26px; font-family:serif; border-bottom:1px solid #e0e0e0; padding-bottom:15px;';
      cardStyle = 'border:1px solid #e0e0e0; border-radius:0px; padding:24px; background-color:#fafafa;';
      titleStyle = 'font-size:22px; font-weight:400; margin-bottom:16px; color:#333; font-family:serif; border-bottom:1px dotted #ccc; padding-bottom:8px;';
      linkStyle = 'color:#4A6FA5; text-decoration:underline; display:block; margin-bottom:10px; font-style:italic;';
      descStyle = 'color:#555; font-size:15px; font-family:serif; line-height:1.6;';
      break;
    case 'modern':
    default:
      sectionTitleStyle = 'text-align:center; font-size:24px; font-weight:300; margin-bottom:20px;';
      cardStyle = 'border:1px solid #e2e8f0; border-radius:8px; padding:20px;';
      titleStyle = 'font-size:18px; font-weight:500; margin-bottom:10px;';
      linkStyle = 'color:#3182ce; text-decoration:underline; display:block; margin-bottom:8px;';
      descStyle = 'color:#666; font-size:14px;';
  }
  
  let portfolioHtml = `
    <div style="margin-bottom:30px;">
      <h2 style="${sectionTitleStyle}">OUR PORTFOLIO</h2>
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
      <div style="${cardStyle}">
        <h3 style="${titleStyle}">
          ${platformIcon} ${link.title}
        </h3>
        <a href="${link.url}" style="${linkStyle}">${link.url}</a>
        ${link.description ? `<p style="${descStyle}">${link.description}</p>` : ''}
      </div>
    `;
  });
  
  portfolioHtml += `
      </div>
    </div>
  `;
  
  return portfolioHtml;
};
