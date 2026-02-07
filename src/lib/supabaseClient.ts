import { createClient } from '@supabase/supabase-js'

// Берём URL и ключ из env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Создаём клиент
export const supabase = createClient(supabaseUrl, supabaseAnonKey)