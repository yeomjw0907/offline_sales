"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-[10px] text-[#8A867D] hover:text-[#191917] hover:bg-[#F7F7F5] transition-colors"
      aria-label="코드 복사"
    >
      {copied ? (
        <Check className="w-4 h-4 text-emerald-600" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  )
}
