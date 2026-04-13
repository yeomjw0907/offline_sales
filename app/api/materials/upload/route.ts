import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { createClient } from "@/lib/db/client"

const MAX_FILE_SIZE = 20 * 1024 * 1024
const DEFAULT_BUCKET = process.env.MATERIALS_STORAGE_BUCKET ?? "partner-materials"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (session.user.role !== "admin" && session.user.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const formData = await req.formData()
  const file = formData.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "파일이 필요합니다." }, { status: 400 })
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "파일 용량은 20MB 이하여야 합니다." }, { status: 400 })
  }

  const ext = file.name.includes(".") ? file.name.split(".").pop() : ""
  const safeName = file.name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .slice(0, 60) || "file"
  const filePath = `materials/${Date.now()}-${safeName}${ext ? `.${ext}` : ""}`

  const supabase = createClient("service")

  // Ensure bucket exists for first-time setup.
  const { data: buckets } = await supabase.storage.listBuckets()
  const hasBucket = (buckets ?? []).some((bucket) => bucket.name === DEFAULT_BUCKET)
  if (!hasBucket) {
    const { error: bucketErr } = await supabase.storage.createBucket(DEFAULT_BUCKET, {
      public: true,
      fileSizeLimit: `${MAX_FILE_SIZE}`,
    })
    if (bucketErr) {
      return NextResponse.json(
        { error: "스토리지 버킷 생성에 실패했습니다. Supabase 설정을 확인해 주세요." },
        { status: 500 }
      )
    }
  }

  const arrayBuffer = await file.arrayBuffer()
  const { error: uploadErr } = await supabase.storage
    .from(DEFAULT_BUCKET)
    .upload(filePath, arrayBuffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    })

  if (uploadErr) {
    return NextResponse.json({ error: uploadErr.message }, { status: 500 })
  }

  const { data: publicUrlData } = supabase.storage
    .from(DEFAULT_BUCKET)
    .getPublicUrl(filePath)

  return NextResponse.json({
    url: publicUrlData.publicUrl,
    path: filePath,
    bucket: DEFAULT_BUCKET,
  })
}
