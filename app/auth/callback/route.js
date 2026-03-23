// app/auth/callback/route.js
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')

  // Koristimo server-side klijent koji zna upravljati kolačićima
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  if (token_hash && type) {
    await supabase.auth.verifyOtp({ token_hash, type })
  }

  // Nakon što je session spremljen u cookie, šaljemo korisnika dalje
  return NextResponse.redirect(`${origin}/moji-termini`)
}