import { create } from 'zustand';
import { getMyAccount, getMyCard, deleteMyAccount, deleteMyCard } from '@/api/userApi';
import { getMyDeposits } from '@/api/depositApi';
import { getMyPayments } from '@/api/paymentApi';
import { getMySettlements } from '@/api/settlementApi';

export const useWalletStore = create((set, get) => ({
    // State
    deposits: [],
    payments: [],
    settlements: [],
    account: null,
    card: null,

    // Loading states (세분화)
    loading: {
        wallet: false,
        deposits: false,
        payments: false,
        settlements: false,
        account: false,
        card: false,
    },

    // Error states
    error: {
        wallet: null,
        deposits: null,
        payments: null,
        settlements: null,
        account: null,
        card: null,
    },

    // Load all wallet data
    loadWalletData: async () => {
        set((state) => ({
            loading: { ...state.loading, wallet: true },
            error: { ...state.error, wallet: null }
        }));
        try {
            const [depositsRes, accountRes, cardRes] = await Promise.all([
                getMyDeposits().catch((err) => {
                    console.error("Failed to load deposits:", err);
                    return [];
                }),
                getMyAccount().catch((err) => {
                    console.error("Failed to load account:", err);
                    return null;
                }),
                getMyCard().catch((err) => {
                    console.error("Failed to load card:", err);
                    return null;
                }),
            ]);

            set({
                deposits: Array.isArray(depositsRes) ? depositsRes : (Array.isArray(depositsRes?.data) ? depositsRes.data : []),
                account: accountRes?.data || null,
                card: cardRes?.data || null
            });
        } catch (error) {
            const errorMessage = error.message || '지갑 정보를 불러오는데 실패했습니다.';
            set((state) => ({
                error: { ...state.error, wallet: errorMessage }
            }));
            console.error("Failed to load wallet data:", error);
        } finally {
            set((state) => ({
                loading: { ...state.loading, wallet: false }
            }));
        }
    },

    // Load deposits only
    loadDeposits: async () => {
        set((state) => ({
            loading: { ...state.loading, deposits: true },
            error: { ...state.error, deposits: null }
        }));
        try {
            const data = await getMyDeposits();
            set({ deposits: Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []) });
        } catch (error) {
            const errorMessage = error.message || '보증금 내역을 불러오는데 실패했습니다.';
            set((state) => ({
                error: { ...state.error, deposits: errorMessage }
            }));
            console.error("Failed to load deposits:", error);
        } finally {
            set((state) => ({
                loading: { ...state.loading, deposits: false }
            }));
        }
    },

    // Load payments only
    loadPayments: async () => {
        set((state) => ({
            loading: { ...state.loading, payments: true },
            error: { ...state.error, payments: null }
        }));
        try {
            const data = await getMyPayments();
            set({ payments: Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []) });
        } catch (error) {
            const errorMessage = error.message || '결제 내역을 불러오는데 실패했습니다.';
            set((state) => ({
                error: { ...state.error, payments: errorMessage }
            }));
            console.error("Failed to load payments:", error);
        } finally {
            set((state) => ({
                loading: { ...state.loading, payments: false }
            }));
        }
    },

    // Load settlements only
    loadSettlements: async () => {
        set((state) => ({
            loading: { ...state.loading, settlements: true },
            error: { ...state.error, settlements: null }
        }));
        try {
            const data = await getMySettlements();
            set({ settlements: Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []) });
        } catch (error) {
            const errorMessage = error.message || '정산 내역을 불러오는데 실패했습니다.';
            set((state) => ({
                error: { ...state.error, settlements: errorMessage }
            }));
            console.error("Failed to load settlements:", error);
        } finally {
            set((state) => ({
                loading: { ...state.loading, settlements: false }
            }));
        }
    },

    // Load account only
    loadAccount: async () => {
        set((state) => ({
            loading: { ...state.loading, account: true },
            error: { ...state.error, account: null }
        }));
        try {
            const data = await getMyAccount();
            set({ account: data?.data || null });
        } catch (error) {
            const errorMessage = error.message || '계좌 정보를 불러오는데 실패했습니다.';
            set((state) => ({
                error: { ...state.error, account: errorMessage }
            }));
            console.error("Failed to load account:", error);
        } finally {
            set((state) => ({
                loading: { ...state.loading, account: false }
            }));
        }
    },

    // Load card only
    loadCard: async () => {
        set((state) => ({
            loading: { ...state.loading, card: true },
            error: { ...state.error, card: null }
        }));
        try {
            const data = await getMyCard();
            set({ card: data?.data || null });
        } catch (error) {
            const errorMessage = error.message || '카드 정보를 불러오는데 실패했습니다.';
            set((state) => ({
                error: { ...state.error, card: errorMessage }
            }));
            console.error("Failed to load card:", error);
        } finally {
            set((state) => ({
                loading: { ...state.loading, card: false }
            }));
        }
    },

    // Delete account
    deleteAccount: async () => {
        set((state) => ({
            loading: { ...state.loading, account: true }
        }));
        try {
            await deleteMyAccount();
            set({ account: null });
            return true;
        } catch (error) {
            console.error("Failed to delete account:", error);
            throw error;
        } finally {
            set((state) => ({
                loading: { ...state.loading, account: false }
            }));
        }
    },

    // Delete card
    deleteCard: async () => {
        set((state) => ({
            loading: { ...state.loading, card: true }
        }));
        try {
            await deleteMyCard();
            set({ card: null });
            return true;
        } catch (error) {
            console.error("Failed to delete card:", error);
            throw error;
        } finally {
            set((state) => ({
                loading: { ...state.loading, card: false }
            }));
        }
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

    getRefundedDeposit: () => {
        const { deposits } = get();
        if (!Array.isArray(deposits)) return 0;

        return deposits
            .filter((d) => d.depositStatus === 'REFUNDED' || d.depositStatus === 'PARTIAL_REFUNDED')
            .reduce((sum, d) => sum + (d.refundAmount || 0), 0);
    },

    getTotalPayment: () => {
        const { payments } = get();
        if (!Array.isArray(payments)) return 0;

        return payments
            .filter((p) => p.paymentStatus === 'PAID')
            .reduce((sum, p) => sum + (p.paymentAmount || 0), 0);
    },

    getTotalSettlement: () => {
        const { settlements } = get();
        if (!Array.isArray(settlements)) return 0;

        return settlements
            .filter((s) => s.settlementStatus === 'COMPLETED')
            .reduce((sum, s) => sum + (s.netAmount || 0), 0);
    },

    getPendingSettlement: () => {
        const { settlements } = get();
        if (!Array.isArray(settlements)) return 0;

        return settlements
            .filter((s) => s.settlementStatus === 'PENDING' || s.settlementStatus === 'IN_PROGRESS')
            .reduce((sum, s) => sum + (s.netAmount || 0), 0);
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
                    wallet: null,
                    deposits: null,
                    payments: null,
                    settlements: null,
                    account: null,
                    card: null,
                }
            });
        }
    },

    // Reset store
    reset: () => {
        set({
            deposits: [],
            payments: [],
            settlements: [],
            account: null,
            card: null,
            loading: {
                wallet: false,
                deposits: false,
                payments: false,
                settlements: false,
                account: false,
                card: false,
            },
            error: {
                wallet: null,
                deposits: null,
                payments: null,
                settlements: null,
                account: null,
                card: null,
            }
        });
    }
}));
