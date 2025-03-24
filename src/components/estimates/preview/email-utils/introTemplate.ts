
export const generateIntroHtml = (clientName: string) => {
  return `
    <div style="text-align:center; margin-bottom:30px;">
      <h1 style="font-size:28px; font-weight:300; letter-spacing:0.5px;">STUDIOSYNC</h1>
      <p style="font-size:20px; font-weight:300; color:#666;">Hello ${clientName}!</p>
      <div style="max-width:600px; margin:20px auto; text-align:center; color:#666; font-size:14px;">
        <p>
          We are a Hyderabad based Wedding Photography firm with over 11 years of experience in non-meddling,
          inventive, photojournalistic approach. We need you to recollect how you felt on your big day. At each
          wedding, We plan to archive genuine minutes and crude feelings in new and remarkable manners.
        </p>
      </div>
    </div>
  `;
};
