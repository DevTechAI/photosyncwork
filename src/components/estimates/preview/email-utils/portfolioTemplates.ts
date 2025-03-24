
import { PortfolioLink } from "../../form/types";

export const generatePortfolioHtml = (portfolioLinks: PortfolioLink[] = []) => {
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
