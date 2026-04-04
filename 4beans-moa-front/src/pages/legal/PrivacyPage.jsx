export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">개인정보처리방침</h1>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">제1조 (개인정보의 처리 목적)</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          MOA(이하 "회사")는 다음의 목적을 위해 개인정보를 처리합니다.
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>회원가입 및 본인 확인</li>
          <li>OTT 구독 파티 생성, 가입, 관리</li>
          <li>결제 및 정산 처리 (Toss Payments, 오픈뱅킹)</li>
          <li>고객 상담 및 민원 처리</li>
          <li>서비스 개선 및 신규 서비스 개발</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">제2조 (처리하는 개인정보 항목)</h2>
        <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
          <li><strong>필수 항목:</strong> 이메일, 닉네임, 비밀번호, 휴대폰 번호</li>
          <li><strong>결제 관련:</strong> 결제 수단 정보(빌링키), 거래 내역</li>
          <li><strong>계좌 인증:</strong> 은행 계좌 정보 (오픈뱅킹 연동)</li>
          <li><strong>자동 수집:</strong> IP 주소, 접속 로그, 쿠키, 서비스 이용 기록</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">제3조 (개인정보의 보유 및 이용 기간)</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          회사는 회원 탈퇴 시 지체 없이 개인정보를 파기합니다. 다만, 관련 법령에 따라
          일정 기간 보관이 필요한 경우 해당 기간 동안 보관합니다.
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>계약 및 청약철회 기록: 5년 (전자상거래법)</li>
          <li>결제 및 공급 기록: 5년 (전자상거래법)</li>
          <li>소비자 불만 처리 기록: 3년 (전자상거래법)</li>
          <li>로그인 기록: 3개월 (통신비밀보호법)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">제4조 (개인정보의 제3자 제공)</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          회사는 원칙적으로 개인정보 외부 제공을 금지합니다. 다만, 다음 경우에 한해 제공합니다:
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li><strong>Toss Payments:</strong> 결제 처리를 위한 결제 수단 정보</li>
          <li><strong>오픈뱅킹:</strong> 계좌 인증 및 정산 이체를 위한 계좌 정보</li>
          <li><strong>법령 요구:</strong> 수사기관의 적법한 요청에 의한 경우</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">제5조 (개인정보의 파기)</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          보유 기간 경과 또는 처리 목적 달성 시 개인정보를 지체 없이 파기합니다.
          전자적 파일 형태는 복구 불가능한 방법으로 영구 삭제하며,
          서면 기록은 분쇄 또는 소각합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">제6조 (정보주체의 권리)</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          회원은 언제든지 자신의 개인정보 열람, 정정, 삭제, 처리 정지를 요청할 수 있습니다.
          마이페이지 또는 고객센터를 통해 요청 가능하며, 회사는 10영업일 내에 조치합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">제7조 (개인정보 보호를 위한 기술적·관리적 조치)</h2>
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>비밀번호 암호화 저장 (BCrypt)</li>
          <li>결제 정보 암호화 저장 (AES-GCM)</li>
          <li>HTTPS 통신 및 HttpOnly 쿠키 사용</li>
          <li>접근 권한 최소화 및 접근 통제</li>
          <li>정기적인 보안 점검 및 업데이트</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">제8조 (개인정보 보호책임자)</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          회사는 개인정보 처리에 관한 책임자를 지정하고 있습니다.
          개인정보와 관련한 문의사항이 있으시면 아래로 연락해 주시기 바랍니다.
        </p>
        <div className="mt-2 rounded-lg bg-muted/50 p-4 text-sm">
          <p>개인정보 보호책임자: 4beans MOA 운영팀</p>
          <p>이메일: support@4beans.kr</p>
        </div>
      </section>

      <div className="mt-12 rounded-lg bg-muted/50 p-4 text-xs text-muted-foreground">
        <p>시행일자: 2026년 4월 1일</p>
        <p>최종수정일자: 2026년 4월 4일</p>
      </div>
    </div>
  );
}
