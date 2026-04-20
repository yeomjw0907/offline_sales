import Link from "next/link"

const sections = [
  {
    title: "1. 서비스 정의",
    body: "ReadyTalk 파트너 운영 플랫폼은 파트너 신청, 승인, 추천인코드 발급, 실적 관리, 정산 운영을 지원하는 서비스입니다.",
  },
  {
    title: "2. 이용 자격",
    body: "이용자는 정확한 신청 정보를 제공해야 하며, 운영자의 승인 정책에 따라 서비스 접근이 제한될 수 있습니다.",
  },
  {
    title: "3. 계정 및 접근",
    body: "로그인은 카카오 계정을 기반으로 처리됩니다. 이용자는 본인 계정의 접근 통제 책임을 부담하며, 운영자는 정책 위반이나 오남용이 확인되면 접근을 제한할 수 있습니다.",
  },
  {
    title: "4. 파트너 승인 및 상태",
    body: "신청 접수만으로 파트너 자격이 확정되지는 않습니다. 운영자는 신청을 승인, 보류, 비활성화 또는 종료할 수 있으며, 유효하게 확정된 실적과 정산 기록은 별도로 보존될 수 있습니다.",
  },
  {
    title: "5. 추천 및 실적 기준",
    body: "성과 귀속은 승인된 추천인코드를 기준으로 판단합니다. 실적은 매장 단위로 관리되며, 파일럿 시작 시점을 기준으로 확정됩니다. 이미 귀속된 실적은 예외적인 운영 판단이 없는 한 재배정되지 않습니다.",
  },
  {
    title: "6. 정산 및 지급",
    body: "확정 건당 기본 정산 금액은 20,000원이며, 지급 시 3.3% 원천징수 등 법정 공제가 적용될 수 있습니다. 월 정산 기준일과 실제 지급 시점은 운영 정책 및 계좌 정보 제출 상태에 따라 달라질 수 있습니다.",
  },
  {
    title: "7. 파트너 의무",
    body: "이용자는 허위 정보 등록, 부정 영업, 허위 매장 실적 입력, 서비스 오남용 행위를 해서는 안 됩니다.",
  },
  {
    title: "8. 자료 제공",
    body: "운영자는 스크립트, 리플렛, 링크 등 영업 자료를 제공할 수 있으며, 해당 자료는 프로그램 범위 내 파트너 활동 목적에 한해 사용할 수 있습니다.",
  },
  {
    title: "9. 이용 제한 및 종료",
    body: "운영자는 사기, 정책 위반, 서비스 방해 행위가 확인되면 사전 통지 또는 사후 통지 방식으로 이용을 제한하거나 종료할 수 있습니다. 회계, 세무, 법적 의무 이행에 필요한 정보는 종료 후에도 보관될 수 있습니다.",
  },
  {
    title: "10. 서비스 변경",
    body: "운영자는 기능, 운영 프로세스, 지급 기준, 자료 구성 등을 변경할 수 있으며, 중요한 변경은 서비스 화면 또는 공지 채널을 통해 고지합니다.",
  },
  {
    title: "11. 문의",
    body: "서비스 및 약관 관련 문의는 아래 연락처로 접수할 수 있습니다. 이메일: yeomjw0907@naver.com",
  },
]

export default function TermsPage() {
  const effectiveDate = "2026-04-20"

  return (
    <main className="min-h-screen bg-[#F7F7F5]">
      <header className="border-b border-[#E9E7E1] bg-white px-6 py-4">
        <Link href="/" className="text-sm text-[#5F5B53] hover:text-[#191917]">
          홈으로 돌아가기
        </Link>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="mb-2 text-2xl font-semibold text-[#191917]">이용약관</h1>
        <p className="mb-8 text-sm text-[#8A867D]">시행일자: {effectiveDate}</p>

        <div className="space-y-6 text-sm leading-7 text-[#5F5B53]">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-2 text-base font-semibold text-[#191917]">{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
