/**
 * Password Verification Modal using CSS variables for theming
 * Theme styles are automatically applied via data-theme attribute on root element
 */
export default function PasswordVerificationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[var(--theme-bg-card)] rounded-[var(--theme-radius)] shadow-[var(--theme-shadow-hover)] w-full max-w-sm p-6 relative">
        <h3 className="text-xl font-bold mb-4 text-[var(--theme-text)]">현재 비밀번호 확인</h3>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] text-2xl hover:bg-[var(--theme-primary-light)] rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          &times;
        </button>

        <div id="passwordUpdateStep1">
          <p className="mb-4 text-sm text-[var(--theme-text-muted)]">
            비밀번호를 변경하려면 현재 로그인된 비밀번호를 입력해 주세요.
          </p>

          <div className="space-y-4">
            <input
              id="currentPassword"
              type="password"
              placeholder="현재 비밀번호"
              className="w-full border-[var(--theme-border-width)] border-[var(--theme-border-light)] bg-[var(--theme-bg-card)] text-[var(--theme-text)] rounded-lg p-3 text-sm focus:ring-2 focus:ring-[var(--theme-focus-ring)] focus:border-[var(--theme-primary)] outline-none transition-all"
            />

            <p
              id="currentPasswordError"
              className="text-red-500 text-xs hidden"
            >
              비밀번호가 일치하지 않습니다.
            </p>

            <button
              id="btnVerifyCurrentPassword"
              className="w-full bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] text-white py-3 rounded-lg text-sm font-semibold transition duration-150"
              type="button"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
