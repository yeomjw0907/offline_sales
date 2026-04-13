import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F7F7F5] flex flex-col">
      <header className="bg-white border-b border-[#E9E7E1] px-6 py-4 flex items-center justify-between">
        <span className="font-semibold text-[#191917] text-lg tracking-tight">
          ReadyTalk 파트너
        </span>
        <Button asChild size="sm">
          <Link href="/login">파트너 로그인</Link>
        </Button>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <p className="text-sm text-[#8A867D] mb-4 tracking-wide uppercase">
          Ready Talk × 98점7도
        </p>
        <h1 className="text-4xl font-semibold text-[#191917] leading-tight mb-5 max-w-xl">
          영업 파트너로 활동하고
          <br />
          투명하게 정산받으세요
        </h1>
        <p className="text-[#5F5B53] text-lg max-w-md mb-10 leading-relaxed">
          추천인 코드 하나로 시작합니다. 내 실적과 정산 현황을 언제든 확인할 수
          있습니다.
        </p>
        <Button asChild size="lg">
          <Link href="/login">카카오로 파트너 시작하기</Link>
        </Button>
      </section>

      <section className="bg-white border-t border-[#E9E7E1] px-6 py-12">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { step: "01", title: "카카오 로그인", desc: "간단한 신청서 작성 후 승인 대기" },
            { step: "02", title: "추천인 코드 수령", desc: "승인 후 나만의 코드 발급" },
            { step: "03", title: "실적 & 정산 확인", desc: "대시보드에서 실시간으로 확인" },
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center gap-2">
              <span className="text-xs font-mono text-[#8A867D]">{item.step}</span>
              <h3 className="font-semibold text-[#191917]">{item.title}</h3>
              <p className="text-sm text-[#5F5B53]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#E9E7E1] px-6 py-4 flex gap-4 text-sm text-[#8A867D]">
        <Link href="/privacy" className="hover:text-[#191917]">개인정보처리방침</Link>
        <Link href="/terms" className="hover:text-[#191917]">이용약관</Link>
      </footer>
    </main>
  )
}
