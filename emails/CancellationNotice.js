export function cancellationAdminEmail({ clientName, clientEmail, clientPhone, dateTime, service }) {
  return {
    subject: `Otkazivanje termina — ${clientName} — ${dateTime}`,
    html: `
      <!DOCTYPE html>
      <html lang="hr">
      <head><meta charset="UTF-8"></head>
      <body style="margin:0;padding:0;background:#F4F4F4;font-family:'Montserrat',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td align="center" style="padding:40px 20px;">
            <table width="100%" style="max-width:520px;background:#fff;border-radius:14px;overflow:hidden;">
              
              <tr><td style="background:#d94f4f;padding:28px 36px;">
                <p style="margin:0;color:#fff;font-size:18px;font-weight:700;">Otkazan termin</p>
                <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:12px;">Linum Brow admin obavijest</p>
              </td></tr>

              <tr><td style="padding:36px;">
                <p style="margin:0 0 20px;font-size:15px;color:#212121;line-height:1.6;">
                  Klijentica je otkazala termin:
                </p>

                <table width="100%" style="background:#F4F4F4;border-radius:10px;padding:20px;margin-bottom:24px;" cellpadding="0" cellspacing="0">
                  <tr><td style="padding:6px 0;">
                    <p style="margin:0;font-size:11px;color:#B5B5B5;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Klijentica</p>
                    <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#212121;">${clientName}</p>
                  </td></tr>
                  <tr><td style="padding:12px 0 6px;border-top:1px solid #E4E4E4;">
                    <p style="margin:0;font-size:11px;color:#B5B5B5;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Kontakt</p>
                    <p style="margin:4px 0 0;font-size:14px;color:#2F2F2F;">${clientEmail} · ${clientPhone}</p>
                  </td></tr>
                  <tr><td style="padding:12px 0 6px;border-top:1px solid #E4E4E4;">
                    <p style="margin:0;font-size:11px;color:#B5B5B5;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Usluga</p>
                    <p style="margin:4px 0 0;font-size:14px;color:#2F2F2F;">${service}</p>
                  </td></tr>
                  <tr><td style="padding:12px 0 6px;border-top:1px solid #E4E4E4;">
                    <p style="margin:0;font-size:11px;color:#B5B5B5;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Otkazani termin</p>
                    <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#d94f4f;">${dateTime}</p>
                  </td></tr>
                </table>

                <p style="margin:0;font-size:13px;color:#888;line-height:1.7;">
                  Termin je automatski oslobođen i dostupan za novu rezervaciju.
                </p>
              </td></tr>

            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `
  }
}