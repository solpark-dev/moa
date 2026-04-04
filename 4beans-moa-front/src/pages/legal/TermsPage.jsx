export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">이용약관</h1>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">제1조 (목적)</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          이 이용약관은 MOA(이하 "서비스")가 제공하는 OTT 구독 공유 파티 모집 및 관리 서비스의 이용 조건과 절차를 규정합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">제2조 (용어의 정의)</h2>
        <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
          <li>"파티"란 OTT 구독 요금을 분할 부담하기 위해 구성된 사용자 그룹을 의미합니다.</li>
          <li>"파티장"이란 파티를 생성하고 구독료를 대표 결제하는 사용자를 의미합니다.</li>
          <li>"파티원"이란 파티에 가입하여 구독료를 분담하는 사용자를 의미합니다.</li>
          <li>"보증금"이란 파티 가입 시 납부하는 금액으로, 파티 종료 시 환불됩니다.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">제3조 (약관의 효력과 변경)</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          서비스는 필요에 따라 이 이용약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지하거나 이메일로 통지합니다.
          변경된 약관 공지 후 7일 이내에 거부의사를 표시하지 않은 경우 동의한 것으로 간주합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">제4조 (서비스의 제공 및 변경)</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          서비스는 연중무휴 24시간 제공을 원칙으로 합니다. 다만, 시스템 점검, 서버 증설, 통신 장애 등의 사유로 일시 중단될 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">제5조 (회원가입 및 탈퇴)</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          회원가입은 이메일, 소셜 로그인(Kakao, Google), 패스 인증 등을 통해 가능합니다.
          회원은 언제든지 마이페이지에서 탈퇴를 요청할 수 있으며, 탈퇴 시 관련 데이터는 법령에 따라 일정 기간 보관 후 삭제됩니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">제6조 (결제 및 환불)</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          서비스 이용 요금은 Toss Payments를 통해 결제됩니다.
          환불 정책은 다음과 같습니다:
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>파티 시작 7일 전까지 탈퇴: 전액 환불</li>
          <li>파티 시작 7일 이내 ~ 시작 전: 2/3 환불</li>
          <li>파티 시작 후 1/3 기간 이내: 2/3 환불</li>
          <li>파티 2/3 기간 경과 후: 환불 불가</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">제7조 (책임 제한)</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          서비스는 OTT 서비스 제공자가 아니며, 구독 요금 분할 관리 플랫폼만을 제공합니다.
          OTT 서비스의 이용 제한, 계정 정지 등에 대해 서비스는 책임을 지지 않습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">제8조 (관할 법원)</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          서비스 이용과 관련하여 분쟁이 발생할 경우, 당사자와 사용자는 원만한 해결을 위해 노력하며,
          소송이 필요한 경우 관할 법원은 관련 법령에 따릅니다.
        </p>
      </section>

      <div className="mt-12 rounded-lg bg-muted/50 p-4 text-xs text-muted-foreground">
        <p>시행일자: 2026년 4월 1일</p>
        <p>최종수정일자: 2026년 4월 4일</p>
      </div>
    </div>
  );
}
