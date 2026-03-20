import { supabase } from '@/lib/supabase'
import { resend } from '@/lib/resend'
import { cancellationAdminEmail } from '@/emails/CancellationNotice'
import { formatDateHr } from '@/lib/utils'

export async function POST(request) {
  try {
    const { bookingId, userEmail } = await request.json()

    // Dohvati rezervaciju po ID i emailu (bez auth provjere)
    const { data: booking } = await supabase
      .from('bookings')
      .select('*, available_slots(date, time)')
      .eq('id', bookingId)
      .eq('email', userEmail)
      .single()

    if (!booking) {
      return Response.json({ error: 'Rezervacija ne postoji' }, { status: 404 })
    }

    // Provjeri je li otkazivanje moguće (24h unaprijed)
    const slotDate = new Date(
      booking.available_slots.date + 'T' + booking.available_slots.time
    )
    const hoursUntil = (slotDate - new Date()) / 1000 / 60 / 60

    if (hoursUntil < 24) {
      return Response.json(
        { error: 'Otkazivanje nije moguće unutar 24h prije termina' },
        { status: 400 }
      )
    }

    // Otkaži
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)

    if (error) throw error

    // Email adminu
    const dateTime = formatDateHr(
      booking.available_slots.date,
      booking.available_slots.time.slice(0, 5)
    )

    const emailContent = cancellationAdminEmail({
      clientName: booking.full_name,
      clientEmail: booking.email,
      clientPhone: booking.phone,
      dateTime,
      service: booking.service || 'Nije navedeno',
    })

    await resend.emails.send({
      from:'Linum Brow <noreply@uumeluuest.resend.app>',
      to: process.env.ADMIN_EMAIL,
      subject: emailContent.subject,
      html: emailContent.html,
    })

    return Response.json({ success: true })

  } catch (error) {
    console.error('Cancel error:', error)
    return Response.json({ error: 'Greška pri otkazivanju' }, { status: 500 })
  }
}