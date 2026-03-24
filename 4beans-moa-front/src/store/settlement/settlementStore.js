import { create } from 'zustand';
import { getMySettlements, getSettlements, getSettlementDetails } from '@/api/settlementApi';

/**
 * Settlement Store
 * 정산 관련 상태 관리
 */
export const useSettlementStore = create((set, get) => ({
    // State
    settlements: [],
    selectedSettlement: null,
    settlementDetails: [],
    
    // Filter state
    filters: {
        startDate: null,
        endDate: null,
    },
    
    // Loading states
    loading: {
        list: false,
        detail: false,
        details: false,
    },
    
    // Error states
    error: {
        list: null,
        detail: null,
        details: null,
    },

    // Actions
    loadSettlements: async (startDate, endDate) => {
        set((state) => ({
            loading: { ...state.loading, list: true },
            error: { ...state.error, list: null }
        }));
        try {
            const data = startDate || endDate 
                ? await getSettlements(startDate, endDate)
                : await getMySettlements();
            
            set({ 
                settlements: Array.isArray(data) ? data : [],
                filters: { startDate, endDate }
            });
        } catch (error) {
            const errorMessage = error.message || '정산 내역을 불러오는데 실패했습니다.';
            set((state) => ({
                error: { ...state.error, list: errorMessage }
            }));
            console.error("Failed to load settlements:", error);
        } finally {
            set((state) => ({
                loading: { ...state.loading, list: false }
            }));
        }
    },

    loadMySettlements: async () => {
        set((state) => ({
            loading: { ...state.loading, list: true },
            error: { ...state.error, list: null }
        }));
        try {
            const data = await getMySettlements();
            set({ 
                settlements: Array.isArray(data) ? data : [],
                filters: { startDate: null, endDate: null }
            });
        } catch (error) {
            const errorMessage = error.message || '내 정산 내역을 불러오는데 실패했습니다.';
            set((state) => ({
                error: { ...state.error, list: errorMessage }
            }));
            console.error("Failed to load my settlements:", error);
        } finally {
            set((state) => ({
                loading: { ...state.loading, list: false }
            }));
        }
    },

    loadSettlementDetails: async (settlementId) => {
        set((state) => ({
            loading: { ...state.loading, details: true },
            error: { ...state.error, details: null }
        }));
        try {
            const data = await getSettlementDetails(settlementId);
            set({ settlementDetails: Array.isArray(data) ? data : [] });
            return data;
        } catch (error) {
            const errorMessage = error.message || '정산 상세 내역을 불러오는데 실패했습니다.';
            set((state) => ({
                error: { ...state.error, details: errorMessage }
            }));
            console.error("Failed to load settlement details:", error);
            throw error;
        } finally {
            set((state) => ({
                loading: { ...state.loading, details: false }
            }));
        }
    },

    // Select settlement for detail view
    selectSettlement: (settlementId) => {
        const { settlements } = get();
        const settlement = settlements.find(s => s.settlementId === settlementId);
        set({ selectedSettlement: settlement || null });
    },

    // Clear selection
    clearSelection: () => {
        set({ 
            selectedSettlement: null,
            settlementDetails: []
        });
    },

    // Set filters
    setFilters: (startDate, endDate) => {
        set({ filters: { startDate, endDate } });
    },

    // Clear filters
    clearFilters: () => {
        set({ filters: { startDate: null, endDate: null } });
    },

    // Computed values (헬퍼 함수)
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

    getFailedSettlement: () => {
        const { settlements } = get();
        if (!Array.isArray(settlements)) return 0;
        
        return settlements
            .filter((s) => s.settlementStatus === 'FAILED')
            .reduce((sum, s) => sum + (s.netAmount || 0), 0);
    },

    getTotalCommission: () => {
        const { settlements } = get();
        if (!Array.isArray(settlements)) return 0;
        
        return settlements
            .filter((s) => s.settlementStatus === 'COMPLETED')
            .reduce((sum, s) => sum + (s.commissionAmount || 0), 0);
    },

    getSettlementsByStatus: (status) => {
        const { settlements } = get();
        if (!Array.isArray(settlements)) return [];
        
        return settlements.filter((s) => s.settlementStatus === status);
    },

    getSettlementsByMonth: (settlementMonth) => {
        const { settlements } = get();
        if (!Array.isArray(settlements)) return [];
        
        return settlements.filter((s) => s.settlementMonth === settlementMonth);
    },

    getSettlementsByParty: (partyId) => {
        const { settlements } = get();
        if (!Array.isArray(settlements)) return [];
        
        return settlements.filter((s) => s.partyId === partyId);
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
                    details: null,
                }
            });
        }
    },

    // Reset store
    reset: () => {
        set({
            settlements: [],
            selectedSettlement: null,
            settlementDetails: [],
            filters: {
                startDate: null,
                endDate: null,
            },
            loading: {
                list: false,
                detail: false,
                details: false,
            },
            error: {
                list: null,
                detail: null,
                details: null,
            }
        });
    }
}));
