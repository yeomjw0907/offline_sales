import { NextResponse } from "next/server"
import QRCode from "qrcode"
import { requirePartner } from "@/lib/auth/session"
import { createClient } from "@/lib/db/client"

export async function GET() {
  try {
    const session = await requirePartner()

    const supabase = createClient("service")
    const { data: profile } = await supabase
      .from("partner_profiles")
      .select("referral_code")
      .eq("user_id", session.user.id)
      .single()

    if (!profile?.referral_code) {
      return NextResponse.json({ error: "Referral code not found" }, { status: 404 })
    }

    const qrUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://readytalk.co.kr"}/ref/${profile.referral_code}`

    const buffer = await QRCode.toBuffer(qrUrl, {
      type: "png",
      width: 300,
      margin: 2,
      color: {
        dark: "#191917",
        light: "#FFFFFF",
      },
    })

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "private, max-age=3600",
      },
    })
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
