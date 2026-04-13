import Link from "next/link"

export default function TermsPage() {
  const effectiveDate = "2026-04-13"

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
        <p className="text-sm text-[#8A867D] mb-8">시행일자: {effectiveDate}</p>
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
              제2조 (정의)
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>&quot;이용자&quot;란 본 약관에 동의하고 서비스를 이용하는 자를 의미합니다.</li>
              <li>&quot;파트너&quot;란 회사가 정한 절차에 따라 활동하는 이용자를 의미합니다.</li>
              <li>&quot;관리자&quot;란 서비스 운영 및 관리를 담당하는 자를 의미합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#191917] mb-2">
              제3조 (약관의 효력 및 변경)
            </h2>
            <p>
              본 약관은 서비스 화면에 게시함으로써 효력이 발생하며, 회사는 관련 법령을 위반하지 않는
              범위에서 약관을 개정할 수 있습니다. 개정 시 시행일 및 개정 사유를 명시하여 사전 공지합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#191917] mb-2">
              제4조 (서비스의 제공 및 변경)
            </h2>
            <p>
              파트너 모집, 추천인 코드 발급, 실적 집계, 정산 관리 등의
              서비스를 제공합니다. 회사는 운영상·기술상 필요에 따라 서비스의
              전부 또는 일부를 변경할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#191917] mb-2">
              제5조 (이용자 계정 및 관리)
            </h2>
            <p>
              이용자는 본인 정보를 정확하게 제공해야 하며, 계정 정보의 관리 책임은 이용자에게 있습니다.
              계정 도용 또는 보안 침해를 인지한 경우 즉시 회사에 통지해야 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#191917] mb-2">
              제6조 (이용자의 의무)
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>허위 정보 등록, 타인 정보 도용, 부정 실적 등록 행위를 해서는 안 됩니다.</li>
              <li>관련 법령 및 회사 정책, 운영상 안내를 준수해야 합니다.</li>
              <li>서비스의 정상적인 운영을 방해하는 행위를 해서는 안 됩니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#191917] mb-2">
              제7조 (정산 기준 및 지급)
            </h2>
            <p>
              정산 기준, 지급 시기, 공제 항목(세금 포함)은 회사의 정산 정책에 따릅니다.
              회사는 관련 법령에 따른 세금(예: 원천징수)을 공제한 후 지급할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#191917] mb-2">
              제8조 (서비스 이용 제한 및 계약 해지)
            </h2>
            <p>
              회사는 이용자가 본 약관 또는 관련 법령을 위반한 경우 사전 통지 후 서비스 이용을 제한하거나
              이용계약을 해지할 수 있습니다. 긴급한 보안 이슈 또는 중대한 위반의 경우 사후 통지할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#191917] mb-2">
              제9조 (지식재산권)
            </h2>
            <p>
              서비스 및 관련 저작물에 대한 권리는 회사에 귀속됩니다. 이용자는 회사의 사전 동의 없이
              서비스를 복제, 배포, 2차적 저작물 작성 등의 방식으로 이용할 수 없습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#191917] mb-2">
              제10조 (면책)
            </h2>
            <p>
              회사는 천재지변, 불가항력, 이용자 귀책 사유, 제3자 제공 서비스 장애 등 회사의 합리적 통제 범위를
              벗어난 사유로 인한 손해에 대하여 책임을 부담하지 않습니다. 다만, 회사의 고의 또는 중대한 과실이 있는 경우는 예외로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#191917] mb-2">
              제11조 (준거법 및 관할)
            </h2>
            <p>
              본 약관은 대한민국 법령을 준거법으로 하며, 서비스와 관련하여 발생한 분쟁은 민사소송법상
              관할 법원에 제기합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#191917] mb-2">
              제12조 (문의)
            </h2>
            <p>
              서비스 및 약관 관련 문의는 아래 이메일로 접수하실 수 있습니다.
              <br />
              이메일: yeomjw0907@naver.com
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
