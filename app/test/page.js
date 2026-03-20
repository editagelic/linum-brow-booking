export default function TestPage() {
  return (
    <div style={{padding: 40}}>
      <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
      <p>KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0,20)}...</p>
    </div>
  )
}