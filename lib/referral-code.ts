import { createClient } from "@/lib/db/client"

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
const CODE_LENGTH = 6

function generate(): string {
  return Array.from(
    { length: CODE_LENGTH },
    () => CHARS[Math.floor(Math.random() * CHARS.length)]
  ).join("")
}

export async function generateUniqueReferralCode(): Promise<string> {
  const supabase = createClient("service")

  for (let attempt = 0; attempt < 10; attempt++) {
    const code = generate()
    const { data } = await supabase
      .from("partner_profiles")
      .select("id")
      .eq("referral_code", code)
      .maybeSingle()

    if (!data) return code
  }

  throw new Error("Failed to generate unique referral code after 10 attempts")
}
