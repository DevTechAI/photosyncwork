
export const generateIntroHtml = (clientName: string, templateId: string = 'modern') => {
  // Different intro styles based on template
  let logoStyle = '';
  let titleStyle = '';
  let descStyle = '';
  let containerStyle = '';
  
  switch(templateId) {
    case 'bold':
      containerStyle = 'text-align:center; margin-bottom:30px; background-color:#f8f8f8; padding:30px; border-left:5px solid #FF719A;';
      logoStyle = 'font-size:32px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#333; text-shadow:1px 1px 0px rgba(255,113,154,0.2);';
      titleStyle = 'font-size:22px; font-weight:600; color:#333; letter-spacing:0.5px; margin-top:16px; border-bottom:2px solid #FF719A; padding-bottom:12px; display:inline-block;';
      descStyle = 'max-width:600px; margin:24px auto; text-align:center; color:#555; font-size:15px; line-height:1.6;';
      break;
    case 'classic':
      containerStyle = 'text-align:center; margin-bottom:30px; background-color:#fafafa; padding:25px; border:1px solid #e0e0e0;';
      logoStyle = 'font-size:30px; font-weight:400; font-family:serif; letter-spacing:1px; color:#333; border-bottom:1px solid #e0e0e0; padding-bottom:10px; display:inline-block;';
      titleStyle = 'font-size:24px; font-weight:400; font-family:serif; color:#555; font-style:italic; margin-top:14px;';
      descStyle = 'max-width:600px; margin:20px auto; text-align:center; color:#777; font-size:15px; line-height:1.7; font-family:serif;';
      break;
    case 'modern':
    default:
      containerStyle = 'text-align:center; margin-bottom:30px; background-color:#ffffff; padding:20px; box-shadow:0 2px 10px rgba(0,0,0,0.05); border-radius:8px;';
      logoStyle = 'font-size:28px; font-weight:300; letter-spacing:0.5px; color:#3182ce; background:linear-gradient(135deg, #3182ce, #805ad5); -webkit-background-clip:text; -webkit-text-fill-color:transparent;';
      titleStyle = 'font-size:20px; font-weight:300; color:#666; margin-top:12px;';
      descStyle = 'max-width:600px; margin:20px auto; text-align:center; color:#666; font-size:14px; line-height:1.5;';
  }
  
  return `
    <div style="${containerStyle}">
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
