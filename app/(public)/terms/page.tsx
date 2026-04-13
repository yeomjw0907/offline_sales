import Link from "next/link"

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F7F7F5]">
      <header className="bg-white border-b border-[#E9E7E1] px-6 py-4">
        <Link href="/" className="text-sm text-[#5F5B53] hover:text-[#191917]">
          ← 홈으로
        </Link>
      </header>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold text-[#191917] mb-8">
          이용약관
        </h1>
        <div className="prose prose-sm text-[#5F5B53] space-y-6">
          <section>
            <h2 className="text-base font-semibold text-[#191917] mb-2">
              제1조 (목적)
            </h2>
            <p>
              본 약관은 98점7도(이하 "회사")가 운영하는 ReadyTalk 파트너
              서비스(이하 "서비스")의 이용 조건 및 절차에 관한 사항을
              규정함을 목적으로 합니다.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-[#191917] mb-2">
              제2조 (서비스의 내용)
            </h2>
            <p>
              파트너 모집, 추천인 코드 발급, 실적 집계, 정산 관리 등의
              서비스를 제공합니다.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-[#191917] mb-2">
              제3조 (파트너의 의무)
            </h2>
            <p>
              파트너는 실적 귀속에 관한 허위 정보를 제공해서는 안 되며,
              회사의 운영 정책을 준수해야 합니다.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-[#191917] mb-2">
              제4조 (정산)
            </h2>
            <p>
              정산은 매월 10일을 기준으로 진행되며, 건당 20,000원에서
              3.3% 원천징수 후 지급됩니다.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
