
export const generateIntroHtml = (clientName: string, templateId: string = 'modern') => {
  // Different intro styles based on template
  let logoStyle = '';
  let titleStyle = '';
  let descStyle = '';
  
  switch(templateId) {
    case 'bold':
      logoStyle = 'font-size:32px; font-weight:700; letter-spacing:1px; text-transform:uppercase;';
      titleStyle = 'font-size:22px; font-weight:600; color:#333; letter-spacing:0.5px; margin-top:16px;';
      descStyle = 'max-width:600px; margin:24px auto; text-align:center; color:#555; font-size:15px; line-height:1.6;';
      break;
    case 'classic':
      logoStyle = 'font-size:30px; font-weight:400; font-family:serif; letter-spacing:1px;';
      titleStyle = 'font-size:24px; font-weight:400; font-family:serif; color:#555; font-style:italic; margin-top:14px;';
      descStyle = 'max-width:600px; margin:20px auto; text-align:center; color:#777; font-size:15px; line-height:1.7; font-family:serif;';
      break;
    case 'modern':
    default:
      logoStyle = 'font-size:28px; font-weight:300; letter-spacing:0.5px;';
      titleStyle = 'font-size:20px; font-weight:300; color:#666; margin-top:12px;';
      descStyle = 'max-width:600px; margin:20px auto; text-align:center; color:#666; font-size:14px; line-height:1.5;';
  }
  
  return `
    <div style="text-align:center; margin-bottom:30px;">
      <h1 style="${logoStyle}">STUDIOSYNC</h1>
      <p style="${titleStyle}">Hello ${clientName}!</p>
      <div style="${descStyle}">
        <p>
          We are a Hyderabad based Wedding Photography firm with over 11 years of experience in non-meddling,
          inventive, photojournalistic approach. We need you to recollect how you felt on your big day. At each
          wedding, We plan to archive genuine minutes and crude feelings in new and remarkable manners.
        </p>
      </div>
    </div>
  `;
};
