"use client"

import { useEffect } from "react"

export default function Home() {
  useEffect(() => {
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log("Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>Check console for Supabase env variables</h1>
      <p>Open DevTools → Console to see them.</p>
    </div>
  )
}
