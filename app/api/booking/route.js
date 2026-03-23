import { createServerSupabase } from '@/lib/supabase-server'
import { resend } from '@/lib/resend'
import { bookingConfirmationEmail } from '@/emails/BookingConfirmation'
import { formatDateHr } from '@/lib/utils'

export async function POST(request) {
  try {
    const { slotId, name, phone, email, note, service } = await request.json()

    const supabase = await createServerSupabase()

    // Provjeri je li termin još slobodan
    const { data: existing } = await supabase
      .from('bookings')
      .select('id')
      .eq('slot_id', slotId)
      .eq('status', 'confirmed')
      .single()

    if (existing) {
      return Response.json({ error: 'Termin je već rezerviran' }, { status: 409 })
    }

    // Dohvati podatke o terminu
    const { data: slot } = await supabase
      .from('available_slots')
      .select('date, time')
      .eq('id', slotId)
      .single()

    if (!slot) {
      return Response.json({ error: 'Termin ne postoji' }, { status: 404 })
    }

    // Spremi rezervaciju
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        slot_id: slotId,
        full_name: name,
        phone,
        email,
        note,
        service,
        status: 'confirmed',
      })
      .select()
      .single()

    if (error) throw error

    // Pošalji email potvrde klijentici
const dateTime = formatDateHr(slot.date, slot.time.slice(0, 5))
const emailContent = bookingConfirmationEmail({ 
  name, 
  dateTime, 
  service,
  date: slot.date,
  time: slot.time.slice(0, 5)
})

await resend.emails.send({
  from:'Linum Brow <noreply@booking.editagelic.com>',
  to: email,
  subject: emailContent.subject,
  html: emailContent.html,
  attachments: [
    {
      filename: 'termin-linum-brow.ics',
      content: emailContent.ics,
    }
  ]
})

    // Pošalji obavijest adminu
    await resend.emails.send({
      from:'Linum Brow <noreply@booking.editagelic.com>',
      to: process.env.ADMIN_EMAIL,
      subject: `Nova rezervacija — ${name} — ${dateTime}`,
      html: `
        <p>Nova rezervacija:</p>
        <p><strong>Klijentica:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        <p><strong>Usluga:</strong> ${service}</p>
        <p><strong>Termin:</strong> ${dateTime}</p>
        ${note ? `<p><strong>Napomena:</strong> ${note}</p>` : ''}
      `,
    })

    return Response.json({ success: true, booking })

  } catch (error) {
   
    return Response.json({ error: 'Greška pri rezervaciji' }, { status: 500 })
  }
}