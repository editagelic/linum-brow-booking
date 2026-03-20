export function bookingReminderEmail({ name, dateTime, service }) {
  return {
    subject: `Podsjetnik — termin sutra u ${dateTime.split(' u ')[1]}`,
    html: `
      <!DOCTYPE html>
      <html lang="hr">
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
      <body style="margin:0;padding:0;background:#F4F4F4;font-family:'Montserrat',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td align="center" style="padding:40px 20px;">
            <table width="100%" style="max-width:520px;background:#fff;border-radius:14px;overflow:hidden;">
              
              <tr><td style="background:#523626;padding:28px 36px;">
                <p style="margin:0;color:#fff;font-size:22px;font-weight:700;">Linum Brow</p>
                <p style="margin:6px 0 0;color:rgba(255,255,255,0.7);font-size:12px;">by Ivana Gelić</p>
              </td></tr>

              <tr><td style="padding:36px 36px 12px;">
                <p style="margin:0 0 8px;font-size:13px;color:#B5B5B5;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">
                  Podsjetnik za termin
                </p>
                <h1 style="margin:0 0 24px;font-size:22px;font-weight:700;color:#212121;line-height:1.3;">
                  ${name}, vidimo se sutra!
                </h1>

                <table width="100%" style="background:#F0EAE6;border-radius:10px;padding:20px;margin-bottom:24px;" cellpadding="0" cellspacing="0">
                  <tr><td style="padding:6px 0;">
                    <p style="margin:0;font-size:11px;color:#8B6455;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Usluga</p>
                    <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#212121;">${service}</p>
                  </td></tr>
                  <tr><td style="padding:12px 0 6px;border-top:1px solid #D9C4BB;">
                    <p style="margin:0;font-size:11px;color:#8B6455;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Datum i vrijeme</p>
                    <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#523626;">${dateTime}</p>
                  </td></tr>
                </table>

                <p style="margin:0 0 24px;font-size:13px;color:#888;line-height:1.7;">
                  Ako ipak ne možete doći, molimo otkažite termin što prije putem linka ispod.
                </p>
              </td></tr>

              <tr><td style="padding:0 36px 36px;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/moji-termini"
                   style="display:inline-block;background:#523626;color:#fff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:13px;font-weight:600;">
                  Otkaži termin →
                </a>
              </td></tr>

              <tr><td style="padding:20px 36px;border-top:1px solid #E4E4E4;">
                <p style="margin:0;font-size:11px;color:#B5B5B5;line-height:1.6;">
                  Linum Brow by Ivana Gelić · Otkazivanje je moguće najkasnije 24h prije termina.
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