import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function createClient(type: "anon" | "service" = "anon") {
  const key =
    type === "service"
      ? process.env.SUPABASE_SERVICE_ROLE_KEY!
      : supabaseAnonKey

  return createSupabaseClient<Database>(supabaseUrl, key, {
    auth: { persistSession: false },
  })
}
