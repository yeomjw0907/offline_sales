import Link from "next/link"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F7F7F5]">
      <header className="bg-white border-b border-[#E9E7E1] px-6 py-4">
        <Link href="/" className="text-sm text-[#5F5B53] hover:text-[#191917]">
          ← 홈으로
        </Link>
      </header>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold text-[#191917] mb-8">
          개인정보처리방침
        </h1>
        <div className="prose prose-sm text-[#5F5B53] space-y-6">
          <section>
            <h2 className="text-base font-semibold text-[#191917] mb-2">
              1. 수집하는 개인정보 항목
            </h2>
            <p>
              서비스 이용을 위해 다음의 개인정보를 수집합니다: 이름, 전화번호,
              이메일, 카카오 계정 식별자, 활동 지역, 정산용 계좌 정보.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-[#191917] mb-2">
              2. 개인정보의 수집 및 이용 목적
            </h2>
            <p>
              파트너 모집 및 운영, 실적 집계, 정산 처리, 서비스 관련 안내를
              위해 개인정보를 이용합니다.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-[#191917] mb-2">
              3. 개인정보의 보유 및 이용기간
            </h2>
            <p>
              서비스 탈퇴 시 또는 수집·이용 목적 달성 후 즉시 파기합니다. 단,
              관련 법령에 의해 보존할 필요가 있는 경우에는 해당 기간 동안
              보관합니다.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-[#191917] mb-2">
              4. 문의
            </h2>
            <p>
              개인정보 관련 문의사항은 운영자(98점7도)에게 연락해 주시기
              바랍니다.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
