export function bookingConfirmationEmail({ name, dateTime, service, date, time }) {

  // Generiraj ICS sadržaj
 function generateICS() {
  const [hh, mm] = time.split(':')
  const [yyyy, mo, dd] = date.split('-')
  
  function pad(n) { return String(n).padStart(2,'0') }
  
  const startH = parseInt(hh)
  const startM = parseInt(mm)
  const endM = startM + 45
  const endH = startH + Math.floor(endM / 60)
  const endMin = endM % 60

  const dtStart = `${yyyy}${mo}${dd}T${pad(startH)}${pad(startM)}00`
  const dtEnd = `${yyyy}${mo}${dd}T${pad(endH)}${pad(endMin)}00`

return [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Linum Brow//HR',
  'X-WR-TIMEZONE:Europe/Zagreb',
  'BEGIN:VEVENT',
  `DTSTART;TZID=Europe/Zagreb:${dtStart}`,
  `DTEND;TZID=Europe/Zagreb:${dtEnd}`,
  `SUMMARY:${service} — Linum Brow`,
  'DESCRIPTION:Termin kod Linum Brow by Ivana Gelić',
  'LOCATION:Linum Brow',
  'STATUS:CONFIRMED',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n')
}

  return {
    subject: `Potvrda rezervacije — ${dateTime}`,
    html: `
      <!DOCTYPE html>
      <html lang="hr">
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
      <body style="margin:0;padding:0;background:#F4F4F4;font-family:'Montserrat',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td align="center" style="padding:40px 20px;">
            <table width="100%" style="max-width:520px;background:#fff;border-radius:14px;overflow:hidden;">
              
              <tr><td style="background:#523626;padding:28px 36px;">
                <p style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">Linum Brow</p>
                <p style="margin:6px 0 0;color:rgba(255,255,255,0.7);font-size:12px;">by Ivana Gelić</p>
              </td></tr>

              <tr><td style="padding:36px 36px 12px;">
                <p style="margin:0 0 8px;font-size:13px;color:#B5B5B5;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Rezervacija potvrđena</p>
                <h1 style="margin:0 0 24px;font-size:22px;font-weight:700;color:#212121;line-height:1.3;">
                  Vidimo se uskoro, ${name}!
                </h1>
                
                <table width="100%" style="background:#F4F4F4;border-radius:10px;padding:20px;margin-bottom:24px;" cellpadding="0" cellspacing="0">
                  <tr><td style="padding:6px 0;">
                    <p style="margin:0;font-size:11px;color:#B5B5B5;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Usluga</p>
                    <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#212121;">${service}</p>
                  </td></tr>
                  <tr><td style="padding:12px 0 6px;border-top:1px solid #E4E4E4;">
                    <p style="margin:0;font-size:11px;color:#B5B5B5;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Datum i vrijeme</p>
                    <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#523626;">${dateTime}</p>
                  </td></tr>
                </table>

                <p style="margin:0 0 16px;font-size:13px;color:#888;line-height:1.7;">
                  Dan prije termina dobit ćete podsjetnik na ovaj email.
                  Ako trebate otkazati, molimo da to učinite <strong style="color:#2F2F2F;">najmanje 24 sata unaprijed</strong>.
                </p>

                <p style="margin:0 0 24px;font-size:13px;color:#523626;font-weight:600;">
                  📅 U privitak emaila dodali smo .ics datoteku — kliknite na nju da dodate termin u Google Calendar, Apple Calendar ili Outlook!
                </p>
              </td></tr>

              <tr><td style="padding:0 36px 36px;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/moji-termini" 
                   style="display:inline-block;background:#523626;color:#fff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:13px;font-weight:600;">
                  Pogledaj moje termine →
                </a>
              </td></tr>

              <tr><td style="padding:20px 36px;border-top:1px solid #E4E4E4;">
                <p style="margin:0;font-size:11px;color:#B5B5B5;line-height:1.6;">
                  Linum Brow by Ivana Gelić · Ovu poruku ste primili jer ste rezervirali termin.
                </p>
              </td></tr>

            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
    ics: generateICS()
  }
}