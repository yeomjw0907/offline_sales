"use client"

type InlineStatusTone = "neutral" | "success" | "error"

const toneClass: Record<InlineStatusTone, string> = {
  neutral: "bg-[#F7F7F5] text-[#5F5B53]",
  success: "bg-emerald-50 text-emerald-700",
  error: "bg-red-50 text-red-600",
}

interface InlineStatusProps {
  message: string
  tone?: InlineStatusTone
  className?: string
}

export function InlineStatus({ message, tone = "neutral", className = "" }: InlineStatusProps) {
  return <p className={`text-xs rounded-[10px] px-3 py-2 ${toneClass[tone]} ${className}`}>{message}</p>
}
