import { create } from 'zustand';

/**
 * 1원 인증 상태 관리 Store
 */
const useBankVerificationStore = create((set, get) => ({
    // ==================== Step 관리 ====================
    // 'input' → 'processing' → 'verify' → 'complete'
    step: 'input',

    // ==================== 입력 데이터 ====================
    formData: {
        bankCode: '',
        bankName: '',
        accountNum: '',
        accountHolder: ''
    },

    // ==================== 인증 데이터 ====================
    verification: {
        bankTranId: null,
        maskedAccount: '',
        expiresAt: null,
        verifyCode: '',     // 가상 은행 모달용
        remainingAttempts: 3
    },

    // ==================== UI 상태 ====================
    isLoading: false,
    error: null,
    showVirtualBankModal: false,

    // ==================== Actions ====================

    // Step 변경
    setStep: (step) => set({ step }),

    // Step 다음으로 이동
    nextStep: () => {
        const stepOrder = ['input', 'processing', 'verify', 'complete'];
        const currentIndex = stepOrder.indexOf(get().step);
        if (currentIndex < stepOrder.length - 1) {
            set({ step: stepOrder[currentIndex + 1] });
        }
    },

    // Step 이전으로 이동
    prevStep: () => {
        const stepOrder = ['input', 'processing', 'verify', 'complete'];
        const currentIndex = stepOrder.indexOf(get().step);
        if (currentIndex > 0) {
            set({ step: stepOrder[currentIndex - 1] });
        }
    },

    // 폼 데이터 업데이트
    setFormData: (data) => set((state) => ({
        formData: { ...state.formData, ...data }
    })),

    // 인증 데이터 업데이트
    setVerification: (data) => set((state) => ({
        verification: { ...state.verification, ...data }
    })),

    // 로딩 상태
    setLoading: (isLoading) => set({ isLoading }),

    // 에러 설정
    setError: (error) => set({ error }),

    // 에러 클리어
    clearError: () => set({ error: null }),

    // 가상 은행 모달 토글
    toggleVirtualBankModal: () => set((state) => ({
        showVirtualBankModal: !state.showVirtualBankModal
    })),

    // 가상 은행 모달 열기
    openVirtualBankModal: () => set({ showVirtualBankModal: true }),

    // 가상 은행 모달 닫기
    closeVirtualBankModal: () => set({ showVirtualBankModal: false }),

    // 전체 초기화
    reset: () => set({
        step: 'input',
        formData: {
            bankCode: '',
            bankName: '',
            accountNum: '',
            accountHolder: ''
        },
        verification: {
            bankTranId: null,
            maskedAccount: '',
            expiresAt: null,
            verifyCode: '',
            remainingAttempts: 3
        },
        isLoading: false,
        error: null,
        showVirtualBankModal: false
    }),

    // 인증 요청 성공 시 데이터 설정
    setVerificationSuccess: (response) => set({
        step: 'verify',
        verification: {
            bankTranId: response.bankTranId,
            maskedAccount: response.maskedAccount || '',
            expiresAt: response.expiresAt,
            verifyCode: response.verifyCode || response.printContent || '',
            remainingAttempts: 3
        },
        error: null
    }),

    // 인증 실패 시 남은 시도 횟수 업데이트
    decrementAttempts: () => set((state) => ({
        verification: {
            ...state.verification,
            remainingAttempts: Math.max(0, state.verification.remainingAttempts - 1)
        }
    }))
}));

export default useBankVerificationStore;
