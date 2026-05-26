const CHANNEL_LABELS: Record<string, string> = {
  kakao_talk: "카톡",
  instagram_dm: "인스타",
  naver_talktalk: "네이버",
  website_widget: "위젯",
}

export function LinkedChannelChips({ channels }: { channels: string[] | null | undefined }) {
  const list = (channels ?? []).filter(Boolean)
  if (list.length === 0) {
    return <span className="text-[10px] text-[#C2BEB3]">-</span>
  }

  return (
    <div className="inline-flex flex-wrap gap-1">
      {list.map((channel) => (
        <span
          key={channel}
          className="inline-flex items-center rounded-full bg-[#F2EFE8] px-1.5 py-0.5 text-[10px] text-[#5F5B53]"
          title={channel}
        >
          {CHANNEL_LABELS[channel] ?? channel}
        </span>
      ))}
    </div>
  )
}
