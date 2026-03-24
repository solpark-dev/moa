import { create } from 'zustand';
import { getMyPayments, getPaymentDetail, retryPayment } from '@/api/paymentApi';

/**
 * Payment Store
 * 결제 관련 상태 관리
 */
export const usePaymentStore = create((set, get) => ({
    // State
    payments: [],
    selectedPayment: null,
    
    // Loading states
    loading: {
        list: false,
        detail: false,
        retry: false,
    },
    
    // Error states
    error: {
        list: null,
        detail: null,
        retry: null,
    },

    // Actions
    loadPayments: async () => {
        set((state) => ({
            loading: { ...state.loading, list: true },
            error: { ...state.error, list: null }
        }));
        try {
            const data = await getMyPayments();
            set({ payments: Array.isArray(data) ? data : [] });
        } catch (error) {
            const errorMessage = error.message || '결제 내역을 불러오는데 실패했습니다.';
            set((state) => ({
                error: { ...state.error, list: errorMessage }
            }));
            console.error("Failed to load payments:", error);
        } finally {
            set((state) => ({
                loading: { ...state.loading, list: false }
            }));
        }
    },

    loadPaymentDetail: async (paymentId) => {
        set((state) => ({
            loading: { ...state.loading, detail: true },
            error: { ...state.error, detail: null }
        }));
        try {
            const data = await getPaymentDetail(paymentId);
            set({ selectedPayment: data });
            return data;
        } catch (error) {
            const errorMessage = error.message || '결제 상세 정보를 불러오는데 실패했습니다.';
            set((state) => ({
                error: { ...state.error, detail: errorMessage }
            }));
            console.error("Failed to load payment detail:", error);
            throw error;
        } finally {
            set((state) => ({
                loading: { ...state.loading, detail: false }
            }));
        }
    },

    retryPaymentAction: async (paymentId) => {
        set((state) => ({
            loading: { ...state.loading, retry: true },
            error: { ...state.error, retry: null }
        }));
        try {
            const result = await retryPayment(paymentId);
            // Refresh payment list
            await get().loadPayments();
            return result;
        } catch (error) {
            const errorMessage = error.message || '결제 재시도에 실패했습니다.';
            set((state) => ({
                error: { ...state.error, retry: errorMessage }
            }));
            console.error("Failed to retry payment:", error);
            throw error;
        } finally {
            set((state) => ({
                loading: { ...state.loading, retry: false }
            }));
        }
    },

    // Select payment for detail view
    selectPayment: (paymentId) => {
        const { payments } = get();
        const payment = payments.find(p => p.paymentId === paymentId);
        set({ selectedPayment: payment || null });
    },

    // Clear selection
    clearSelection: () => {
        set({ selectedPayment: null });
    },

    // Computed values (헬퍼 함수)
    getTotalPayment: () => {
        const { payments } = get();
        if (!Array.isArray(payments)) return 0;
        
        return payments
            .filter((p) => p.paymentStatus === 'PAID')
            .reduce((sum, p) => sum + (p.paymentAmount || 0), 0);
    },

    getPendingPayment: () => {
        const { payments } = get();
        if (!Array.isArray(payments)) return 0;
        
        return payments
            .filter((p) => p.paymentStatus === 'PENDING')
            .reduce((sum, p) => sum + (p.paymentAmount || 0), 0);
    },

    getFailedPayment: () => {
        const { payments } = get();
        if (!Array.isArray(payments)) return 0;
        
        return payments
            .filter((p) => p.paymentStatus === 'FAILED')
            .reduce((sum, p) => sum + (p.paymentAmount || 0), 0);
    },

    getPaymentsByStatus: (status) => {
        const { payments } = get();
        if (!Array.isArray(payments)) return [];
        
        return payments.filter((p) => p.paymentStatus === status);
    },

    getPaymentsByMonth: (targetMonth) => {
        const { payments } = get();
        if (!Array.isArray(payments)) return [];
        
        return payments.filter((p) => p.targetMonth === targetMonth);
    },

    getPaymentsByParty: (partyId) => {
        const { payments } = get();
        if (!Array.isArray(payments)) return [];
        
        return payments.filter((p) => p.partyId === partyId);
    },

    // Clear specific error
    clearError: (key) => {
        if (key) {
            set((state) => ({
                error: { ...state.error, [key]: null }
            }));
        } else {
            // Clear all errors
            set({
                error: {
                    list: null,
                    detail: null,
                    retry: null,
                }
            });
        }
    },

    // Reset store
    reset: () => {
        set({
            payments: [],
            selectedPayment: null,
            loading: {
                list: false,
                detail: false,
                retry: false,
            },
            error: {
                list: null,
                detail: null,
                retry: null,
            }
        });
    }
}));
