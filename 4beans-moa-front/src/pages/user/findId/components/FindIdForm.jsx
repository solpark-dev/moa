/**
 * 아이디 찾기 폼 컴포넌트
 * CSS 변수 기반 테마 적용
 */
export function FindIdForm({ onPassAuth, isLoading }) {
  return (
    <div className="border border-[var(--theme-border-light)] rounded-xl p-8 bg-[var(--theme-bg-card)]">
      <p className="text-[var(--theme-text-muted)] mb-8 text-center leading-relaxed">
        PASS 버튼을 눌러 본인 인증을 진행해 주세요.
        <br />
        인증이 완료되면 이메일이 자동으로 표시됩니다.
      </p>

      <div className="flex justify-center mb-6">
        <button
          onClick={onPassAuth}
          disabled={isLoading}
          className="bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] text-white px-12 py-4 rounded-xl text-lg font-bold cursor-pointer shadow-[var(--theme-shadow)] transition disabled:opacity-50"
        >
          {isLoading ? "처리중..." : "PASS"}
        </button>
      </div>
    </div>
  );
}
