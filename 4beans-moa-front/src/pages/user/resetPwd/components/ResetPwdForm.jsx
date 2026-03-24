/**
 * 비밀번호 재설정 폼 컴포넌트
 * CSS 변수 기반 테마 적용
 */
export function ResetPwdForm() {
  return (
    <div
      id="resetFormArea"
      className="bg-[var(--theme-bg-card)] border border-[var(--theme-border-light)] rounded-3xl shadow-[var(--theme-shadow)] space-y-4 pt-4 hidden p-5"
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <div className="space-y-1">
          <label className="font-black text-sm text-[var(--theme-text)]">새 비밀번호</label>
          <input
            id="resetNewPassword"
            type="password"
            autoComplete="new-password"
            className="w-full border border-[var(--theme-border-light)] bg-[var(--theme-bg-card)] rounded-2xl shadow-[var(--theme-shadow)] p-3 text-[var(--theme-text)] placeholder:text-[var(--theme-text-muted)] focus-visible:ring-0 focus:outline-none focus:border-[var(--theme-primary)]"
            placeholder="8~20자/ 영문·숫자·특수문자 조합"
          />
        </div>

        <div className="space-y-1">
          <label className="font-black text-sm text-[var(--theme-text)]">
            새 비밀번호 확인
          </label>
          <input
            id="resetNewPasswordCheck"
            type="password"
            autoComplete="new-password"
            className="w-full border border-[var(--theme-border-light)] bg-[var(--theme-bg-card)] rounded-2xl shadow-[var(--theme-shadow)] p-3 text-[var(--theme-text)] placeholder:text-[var(--theme-text-muted)] focus-visible:ring-0 focus:outline-none focus:border-[var(--theme-primary)]"
            placeholder="같은 비밀번호를 입력해 주세요"
          />
        </div>

        <button
          id="btnResetPwd"
          type="submit"
          className="w-full bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] text-white border border-[var(--theme-primary)] rounded-2xl shadow-[var(--theme-shadow)] font-black py-3 text-lg active:translate-x-[2px] active:translate-y-[2px] transition"
        >
          비밀번호 변경
        </button>
      </form>
    </div>
  );
}
