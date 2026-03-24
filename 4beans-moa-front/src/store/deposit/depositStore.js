import { create } from 'zustand';
import { getMyDeposits } from '@/api/depositApi';

/**
 * Deposit Store
 * 보증금 관련 상태 관리
 */
export const useDepositStore = create((set, get) => ({
    // State
    deposits: [],
    selectedDeposit: null,
    
    // Loading states
    loading: {
        list: false,
        detail: false,
        refund: false,
    },
    
    // Error states
    error: {
        list: null,
        detail: null,
        refund: null,
    },

    // Actions
    loadDeposits: async () => {
        set((state) => ({
            loading: { ...state.loading, list: true },
            error: { ...state.error, list: null }
        }));
        try {
            const data = await getMyDeposits();
            set({ deposits: Array.isArray(data) ? data : [] });
        } catch (error) {
            const errorMessage = error.message || '보증금 내역을 불러오는데 실패했습니다.';
            set((state) => ({
                error: { ...state.error, list: errorMessage }
            }));
            console.error("Failed to load deposits:", error);
        } finally {
            set((state) => ({
                loading: { ...state.loading, list: false }
            }));
        }
    },

    // Select deposit for detail view
    selectDeposit: (depositId) => {
        const { deposits } = get();
        const deposit = deposits.find(d => d.depositId === depositId);
        set({ selectedDeposit: deposit || null });
    },

    // Clear selection
    clearSelection: () => {
        set({ selectedDeposit: null });
    },

    // Computed values (헬퍼 함수)
    getTotalDeposit: () => {
        const { deposits } = get();
        if (!Array.isArray(deposits)) return 0;
        
        return deposits
            .filter((d) => d.depositStatus === 'PAID' || d.depositStatus === 'HELD')
            .reduce((sum, d) => sum + (d.depositAmount || 0), 0);
    },

    getHeldDeposit: () => {
        const { deposits } = get();
        if (!Array.isArray(deposits)) return 0;
        
        return deposits
            .filter((d) => d.depositStatus === 'HELD')
            .reduce((sum, d) => sum + (d.depositAmount || 0), 0);
    },

    getPendingDeposit: () => {
        const { deposits } = get();
        if (!Array.isArray(deposits)) return 0;
        
        return deposits
            .filter((d) => d.depositStatus === 'PENDING')
            .reduce((sum, d) => sum + (d.depositAmount || 0), 0);
    },

    getRefundedDeposit: () => {
        const { deposits } = get();
        if (!Array.isArray(deposits)) return 0;
        
        return deposits
            .filter((d) => d.depositStatus === 'REFUNDED' || d.depositStatus === 'PARTIAL_REFUNDED')
            .reduce((sum, d) => sum + (d.refundAmount || 0), 0);
    },

    getDepositsByStatus: (status) => {
        const { deposits } = get();
        if (!Array.isArray(deposits)) return [];
        
        return deposits.filter((d) => d.depositStatus === status);
    },

    getDepositsByType: (type) => {
        const { deposits } = get();
        if (!Array.isArray(deposits)) return [];
        
        return deposits.filter((d) => d.depositType === type);
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
                    refund: null,
                }
            });
        }
    },

    // Reset store
    reset: () => {
        set({
            deposits: [],
            selectedDeposit: null,
            loading: {
                list: false,
                detail: false,
                refund: false,
            },
            error: {
                list: null,
                detail: null,
                refund: null,
            }
        });
    }
}));
