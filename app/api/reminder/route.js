import { createServerSupabase } from '@/lib/supabase-server'
import { resend } from '@/lib/resend'
import { bookingReminderEmail } from '@/emails/BookingReminder'
import { formatDateHr } from '@/lib/utils'

export async function GET(request) {
  // Zaštita — samo Vercel Cron može pozvati
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createServerSupabase()

    // Dohvati termine za sutra
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]

    const { data: bookings } = await supabase
      .from('bookings')
      .select('*, available_slots!inner(date, time)')
      .eq('available_slots.date', tomorrowStr)
      .eq('status', 'confirmed')

    if (!bookings?.length) {
      return Response.json({ sent: 0 })
    }

    // Pošalji podsjetnik svakoj klijentici
    let sent = 0
    for (const booking of bookings) {
      const dateTime = formatDateHr(
        booking.available_slots.date,
        booking.available_slots.time.slice(0, 5)
      )
      const emailContent = bookingReminderEmail({
        name: booking.full_name,
        dateTime,
        service: booking.service || 'Termin',
      })

      await resend.emails.send({
        from:'Linum Brow <noreply@uumeluuest.resend.app>',
        to: booking.email,
        subject: emailContent.subject,
        html: emailContent.html,
      })
      sent++
    }

    return Response.json({ sent })

  } catch (error) {
    console.error('Reminder error:', error)
    return Response.json({ error: 'Greška' }, { status: 500 })
  }
}