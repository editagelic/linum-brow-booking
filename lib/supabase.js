import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://knwpzpveriiyfobkdinx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtud3B6cHZlcmlpeWZvYmtkaW54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MTg5MDksImV4cCI6MjA4OTQ5NDkwOX0.IwhGXgHKj1-OH3z9mL2vPvoNtfBimaKhskWNzDFkHP8',
  {
    db: { schema: 'public' },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    realtime: { params: { eventsPerSecond: 10 } }
  }
)

