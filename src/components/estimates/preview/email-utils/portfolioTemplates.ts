
import { PortfolioLink } from "../../form/types";

export const generatePortfolioHtml = (portfolioLinks: PortfolioLink[] = [], templateId: string = 'modern') => {
  if (portfolioLinks.length === 0) {
    return '';
  }
  
  // Different styling based on template
  let sectionTitleStyle = '';
  let containerStyle = '';
  let gridStyle = '';
  let cardStyle = '';
  let titleStyle = '';
  let linkStyle = '';
  let descStyle = '';
  
  switch(templateId) {
    case 'bold':
      containerStyle = 'margin-bottom:40px; background-color:#f8f8f8; padding:30px;';
      sectionTitleStyle = 'text-align:center; font-size:26px; font-weight:600; margin-bottom:24px; text-transform:uppercase; letter-spacing:1px; color:#333; border-bottom:3px solid #FF719A; padding-bottom:10px; display:inline-block; margin-left:auto; margin-right:auto;';
      gridStyle = 'display:grid; grid-template-columns:1fr 1fr; gap:25px;';
      cardStyle = 'border:none; border-bottom:3px solid #FF719A; padding:24px; background-color:#fff; box-shadow:0 3px 10px rgba(0,0,0,0.1);';
      titleStyle = 'font-size:20px; font-weight:600; margin-bottom:16px; color:#222; text-transform:uppercase; border-left:3px solid #FF719A; padding-left:12px;';
      linkStyle = 'color:#FF719A; text-decoration:none; display:block; margin-bottom:12px; font-weight:500; transition:all 0.3s;';
      descStyle = 'color:#444; font-size:15px; line-height:1.5; border-top:1px solid #eee; padding-top:10px; margin-top:10px;';
      break;
    case 'classic':
      containerStyle = 'margin-bottom:40px; background-color:#fafafa; padding:30px; border:1px solid #e0e0e0;';
      sectionTitleStyle = 'text-align:center; font-size:28px; font-weight:400; margin-bottom:26px; font-family:serif; border-bottom:1px solid #e0e0e0; padding-bottom:15px;';
      gridStyle = 'display:grid; grid-template-columns:1fr 1fr; gap:30px;';
      cardStyle = 'border:1px solid #e0e0e0; padding:24px; background-color:#fff;';
      titleStyle = 'font-size:22px; font-weight:400; margin-bottom:16px; color:#333; font-family:serif; border-bottom:1px dotted #ccc; padding-bottom:8px;';
      linkStyle = 'color:#4A6FA5; text-decoration:underline; display:block; margin-bottom:10px; font-style:italic;';
      descStyle = 'color:#555; font-size:15px; font-family:serif; line-height:1.6; font-style:italic; margin-top:10px;';
      break;
    case 'modern':
    default:
      containerStyle = 'margin-bottom:30px; background-color:#ffffff; padding:25px; box-shadow:0 2px 10px rgba(0,0,0,0.05); border-radius:8px;';
      sectionTitleStyle = 'text-align:center; font-size:24px; font-weight:300; margin-bottom:25px; color:#3182ce;';
      gridStyle = 'display:grid; grid-template-columns:1fr 1fr; gap:20px;';
      cardStyle = 'border:1px solid #e2e8f0; border-radius:8px; padding:20px; transition:transform 0.2s, box-shadow 0.2s; background-color:#fafafa;';
      titleStyle = 'font-size:18px; font-weight:500; margin-bottom:12px; color:#3182ce;';
      linkStyle = 'color:#3182ce; text-decoration:underline; display:block; margin-bottom:8px; transition:color 0.2s;';
      descStyle = 'color:#666; font-size:14px; line-height:1.5; margin-top:10px;';
  }
  
  let portfolioHtml = `
    <div style="${containerStyle}">
      <h2 style="${sectionTitleStyle}">OUR PORTFOLIO</h2>
      <div style="${gridStyle}">
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
        <a href="${link.url}" style="${linkStyle}" target="_blank">${link.url}</a>
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
