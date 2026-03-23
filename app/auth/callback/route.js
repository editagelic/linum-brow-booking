import { createServerSupabase } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')

  const supabase = await createServerSupabase()

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  if (token_hash && type) {
    await supabase.auth.verifyOtp({ token_hash, type })
  }

  return NextResponse.redirect(`${origin}/moji-termini`)
}
```

Zatim idi na Supabase → **Authentication → URL Configuration** i postavi redirect URL na:
```
