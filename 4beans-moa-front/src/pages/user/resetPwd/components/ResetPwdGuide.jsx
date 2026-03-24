/**
 * 비밀번호 재설정 가이드 컴포넌트
 * CSS 변수 기반 테마 적용
 */
export function ResetPwdGuide() {
  return (
    <div className="bg-[var(--theme-bg-card)] border border-[var(--theme-border-light)] rounded-3xl shadow-[var(--theme-shadow)] space-y-4 p-5">
      <p id="resetGuide" className="text-[var(--theme-text-muted)] text-center leading-relaxed">
        PASS 버튼을 눌러 본인 인증을 진행해주세요
        <br />
        인증이 완료되면 비밀번호를 입력하실 수 있습니다.
      </p>

      <div className="flex justify-center">
        <button
          id="btnResetPassAuth"
          type="button"
          className="bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] text-white px-12 py-3 rounded-2xl text-lg font-black border border-[var(--theme-primary)] shadow-[var(--theme-shadow)] active:translate-x-[2px] active:translate-y-[2px] transition"
        >
          PASS 본인인증
        </button>
      </div>
    </div>
  );
}
