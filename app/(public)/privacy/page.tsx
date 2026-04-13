import Link from "next/link"

export default function PrivacyPage() {
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
          개인정보처리방침
        </h1>
        <p className="text-sm text-[#8A867D] mb-8">
          시행일자: {effectiveDate}
        </p>
        <div className="prose prose-sm text-[#5F5B53] space-y-6">
          <section>
            <h2 className="text-base font-semibold text-[#191917] mb-2">
              1. 총칙
            </h2>
            <p>
              98점7도(이하 &quot;회사&quot;)는 「개인정보 보호법」 등 관련 법령을 준수하며,
              이용자의 개인정보를 적법하고 안전하게 처리하기 위해 본 개인정보처리방침을
              수립·공개합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#191917] mb-2">
              2. 처리하는 개인정보 항목
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>필수: 이름, 전화번호, 이메일, 카카오 계정 식별자, 활동 지역, 활동 유형</li>
              <li>선택: 자기소개, 마케팅 수신 동의 여부</li>
              <li>정산 처리 시: 예금주명, 은행명, 계좌번호(암호화 저장)</li>
              <li>서비스 이용 과정: 접속 로그, 기기/브라우저 정보, IP 주소</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#191917] mb-2">
              3. 개인정보의 처리 목적
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>회원 식별 및 본인 확인, 계정 관리</li>
              <li>파트너 신청 접수 및 운영, 추천인 코드 발급</li>
              <li>실적 산정, 수수료 정산, 세무 처리 대응</li>
              <li>고지사항 전달, 민원 처리, 분쟁 대응</li>
              <li>서비스 안정성 확보 및 부정 이용 방지</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#191917] mb-2">
              4. 개인정보의 보유 및 이용기간
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>원칙적으로 회원 탈퇴 또는 처리 목적 달성 시 지체 없이 파기합니다.</li>
              <li>
                다만, 관계 법령에 따라 보관이 필요한 경우 아래 기간 동안 보관할 수 있습니다.
              </li>
              <li>계약/청약철회 기록: 5년</li>
              <li>대금결제 및 재화 공급 기록: 5년</li>
              <li>소비자 불만 또는 분쟁처리 기록: 3년</li>
              <li>접속기록: 3개월</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#191917] mb-2">
              5. 개인정보의 제3자 제공
            </h2>
            <p>
              회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만,
              이용자의 별도 동의가 있거나 법령에 특별한 규정이 있는 경우에 한하여 제공합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#191917] mb-2">
              6. 개인정보 처리의 위탁
            </h2>
            <p>회사는 서비스 운영을 위해 아래와 같이 개인정보 처리 업무를 위탁할 수 있습니다.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>클라우드/호스팅: Vercel</li>
              <li>데이터베이스/스토리지: Supabase</li>
              <li>인증 제공자: Kakao</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#191917] mb-2">
              7. 이용자의 권리와 행사 방법
            </h2>
            <p>
              이용자는 언제든지 개인정보 열람, 정정, 삭제, 처리정지를 요구할 수 있으며,
              회사는 관련 법령에서 정한 바에 따라 지체 없이 조치합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#191917] mb-2">
              8. 개인정보의 파기 절차 및 방법
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>파기 사유가 발생한 개인정보는 지체 없이 파기합니다.</li>
              <li>전자적 파일은 복구가 불가능한 기술적 방법으로 삭제합니다.</li>
              <li>종이 문서는 분쇄 또는 소각 방식으로 파기합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#191917] mb-2">
              9. 개인정보의 안전성 확보 조치
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>접근권한 최소화 및 권한 관리</li>
              <li>개인정보 저장 시 암호화 및 전송 구간 암호화(HTTPS)</li>
              <li>접속기록 보관 및 보안 업데이트 적용</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#191917] mb-2">
              10. 쿠키 및 유사 기술
            </h2>
            <p>
              회사는 로그인 세션 유지 및 서비스 품질 개선을 위해 쿠키를 사용할 수 있습니다.
              이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나, 일부 기능 이용이 제한될 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#191917] mb-2">
              11. 개인정보 보호책임자 및 문의처
            </h2>
            <p>
              개인정보 관련 문의 및 권리행사는 아래 연락처를 통해 접수하실 수 있습니다.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>담당자: 개인정보 보호책임자</li>
              <li>이메일: yeomjw0907@naver.com</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#191917] mb-2">
              12. 고지 의무
            </h2>
            <p>
              본 개인정보처리방침의 내용 추가, 삭제 및 수정이 있을 경우 시행일 7일 전부터
              서비스 내 공지사항을 통해 고지합니다. 다만, 이용자 권리에 중대한 변경이 있는 경우
              최소 30일 전에 고지합니다.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
