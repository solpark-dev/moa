/**
 * 아이디 찾기 결과 컴포넌트
 * CSS 변수 기반 테마 적용
 */
export function FindIdResult({ email }) {
  return (
    <div className="border border-[var(--theme-border-light)] rounded-xl p-8 bg-[var(--theme-bg-card)]">
      <div className="space-y-3 pt-4 animate-in fade-in duration-300">
        <p className="text-[var(--theme-text-muted)] text-sm text-center">회원가입된 이메일</p>

        <div className="w-full border border-[var(--theme-border-light)] p-3 rounded-lg text-center font-semibold bg-[var(--theme-bg-card)] text-[var(--theme-text)] text-lg">
          {email}
        </div>

        <a
          href="/login"
          className="block mt-4 px-6 py-3 bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] text-white rounded-lg w-full text-center text-sm font-semibold cursor-pointer transition"
        >
          로그인하러 가기
        </a>
      </div>
    </div>
  );
}
