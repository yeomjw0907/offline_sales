interface Props {
  signupAt?: string | null
  trialRequestedAt?: string | null
  channelLinkedAt?: string | null
  size?: "sm" | "md"
}

const STEPS = [
  { key: "signup", label: "가입" },
  { key: "trial", label: "체험" },
  { key: "channel", label: "연동" },
] as const

export function LeadFunnelProgress({
  signupAt,
  trialRequestedAt,
  channelLinkedAt,
  size = "sm",
}: Props) {
  const reached = {
    signup: Boolean(signupAt),
    trial: Boolean(trialRequestedAt),
    channel: Boolean(channelLinkedAt),
  }

  const dotSize = size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5"
  const textSize = size === "sm" ? "text-[10px]" : "text-xs"

  return (
    <div className="inline-flex items-center gap-1.5" aria-label="진행 단계">
      {STEPS.map((step) => {
        const on = reached[step.key]
        return (
          <span
            key={step.key}
            className={`inline-flex items-center gap-1 ${textSize} ${
              on ? "text-[#191917]" : "text-[#C2BEB3]"
            }`}
            title={
              on
                ? `${step.label} 완료`
                : `${step.label} 미완료`
            }
          >
            <span
              className={`${dotSize} rounded-full ${
                on ? "bg-[#2F7D4A]" : "bg-[#E3DFD6]"
              }`}
              aria-hidden="true"
            />
            {step.label}
          </span>
        )
      })}
    </div>
  )
}
