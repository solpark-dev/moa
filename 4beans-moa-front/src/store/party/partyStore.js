import { create } from 'zustand';
import {
    fetchPartyList,
    fetchMyParties,
    fetchPartyDetail,
    createParty,
    joinParty,
    leaveParty,
    fetchProducts,
    updateOttAccount,
    processLeaderDeposit
} from '@/hooks/party/partyService';

export const usePartyStore = create((set, get) => ({
    // State
    parties: [],
    myParties: [],
    currentParty: null,
    products: [], // Service types (Netflix, Disney+, etc.)

    // Pagination State
    page: 1,
    hasMore: true,
    totalPages: 0,

    // Loading states (세분화)
    loading: {
        parties: false,
        myParties: false,
        detail: false,
        create: false,
        join: false,
        leave: false,
        products: false,
    },

    // Error states
    error: {
        parties: null,
        myParties: null,
        detail: null,
        create: null,
        join: null,
        leave: null,
        products: null,
    },

    // Actions
    loadParties: async (params = {}, isInitial = false) => {
        const state = get();

        // 초기화 요청이거나 필터가 변경된 경우
        if (isInitial) {
            set({ parties: [], page: 1, hasMore: true });
        }

        // 더 로드할 데이터가 없으면 중단 (단, 초기화 제외)
        if (!isInitial && !state.hasMore && state.parties.length > 0) return;

        set((state) => ({
            loading: { ...state.loading, parties: true },
            error: { ...state.error, parties: null }
        }));

        try {
            const currentPage = isInitial ? 1 : state.page;
            const queryParams = {
                page: currentPage,
                size: 10, // 한 번에 가져올 개수
                sort: params.sort || 'latest',
                startDate: params.startDate || null,
                ...params
            };

            const data = await fetchPartyList(queryParams);

            // 데이터가 없으면 더 이상 로드할 게 없음
            if (!data || data.length === 0) {
                set({ hasMore: false, loading: { ...state.loading, parties: false } });
                return;
            }

            set((state) => ({
                parties: isInitial ? data : [...state.parties, ...data],
                page: currentPage + 1,
                hasMore: data.length === 10, // 가져온 데이터가 요청 사이즈보다 적으면 끝난 것
                loading: { ...state.loading, parties: false }
            }));
        } catch (error) {
            set((state) => ({
                error: { ...state.error, parties: error.message || '파티 목록을 불러오는데 실패했습니다.' },
                loading: { ...state.loading, parties: false }
            }));
            console.error("Failed to load parties:", error);
        }
    },

    loadMyParties: async () => {
        set((state) => ({
            loading: { ...state.loading, myParties: true },
            error: { ...state.error, myParties: null }
        }));
        try {
            const data = await fetchMyParties();
            set({ myParties: data || [] });
        } catch (error) {
            set((state) => ({
                error: { ...state.error, myParties: error.message || '내 파티 목록을 불러오는데 실패했습니다.' }
            }));
            console.error("Failed to load my parties:", error);
        } finally {
            set((state) => ({
                loading: { ...state.loading, myParties: false }
            }));
        }
    },

    loadPartyDetail: async (id) => {
        set((state) => ({
            loading: { ...state.loading, detail: true },
            error: { ...state.error, detail: null },
            currentParty: null
        }));
        try {
            const data = await fetchPartyDetail(id);
            set({ currentParty: data });
            return data;
        } catch (error) {
            const errorMessage = error.message || '파티 상세 정보를 불러오는데 실패했습니다.';
            set((state) => ({
                error: { ...state.error, detail: errorMessage }
            }));
            console.error("Failed to load party detail:", error);
            throw error;
        } finally {
            set((state) => ({
                loading: { ...state.loading, detail: false }
            }));
        }
    },

    loadProducts: async () => {
        set((state) => ({
            loading: { ...state.loading, products: true },
            error: { ...state.error, products: null }
        }));
        try {
            const data = await fetchProducts();
            set({ products: data || [] });
        } catch (error) {
            set((state) => ({
                error: { ...state.error, products: error.message || '상품 목록을 불러오는데 실패했습니다.' }
            }));
            console.error("Failed to load products:", error);
        } finally {
            set((state) => ({
                loading: { ...state.loading, products: false }
            }));
        }
    },

    createNewParty: async (partyData) => {
        set((state) => ({
            loading: { ...state.loading, create: true },
            error: { ...state.error, create: null }
        }));
        try {
            const data = await createParty(partyData);
            return data;
        } catch (error) {
            const errorMessage = error.message || '파티 생성에 실패했습니다.';
            set((state) => ({
                error: { ...state.error, create: errorMessage }
            }));
            console.error("Failed to create party:", error);
            throw error;
        } finally {
            set((state) => ({
                loading: { ...state.loading, create: false }
            }));
        }
    },

    joinPartyAction: async (partyId, paymentData) => {
        set((state) => ({
            loading: { ...state.loading, join: true },
            error: { ...state.error, join: null }
        }));
        try {
            const res = await joinParty(partyId, paymentData);
            // Refresh current party and my parties
            await get().loadPartyDetail(partyId);
            get().loadMyParties();
            return res;
        } catch (error) {
            const errorMessage = error.message || '파티 참여에 실패했습니다.';
            set((state) => ({
                error: { ...state.error, join: errorMessage }
            }));
            console.error("Failed to join party:", error);
            throw error;
        } finally {
            set((state) => ({
                loading: { ...state.loading, join: false }
            }));
        }
    },

    leavePartyAction: async (partyId) => {
        set((state) => ({
            loading: { ...state.loading, leave: true },
            error: { ...state.error, leave: null }
        }));
        try {
            await leaveParty(partyId);
            // Refresh my parties
            get().loadMyParties();
        } catch (error) {
            const errorMessage = error.message || '파티 탈퇴에 실패했습니다.';
            set((state) => ({
                error: { ...state.error, leave: errorMessage }
            }));
            console.error("Failed to leave party:", error);
            throw error;
        } finally {
            set((state) => ({
                loading: { ...state.loading, leave: false }
            }));
        }
    },

    updateOttAccountAction: async (partyId, ottData) => {
        set((state) => ({
            loading: { ...state.loading, detail: true },
            error: { ...state.error, detail: null }
        }));
        try {
            await updateOttAccount(partyId, ottData);
            // Refresh party detail
            await get().loadPartyDetail(partyId);
        } catch (error) {
            const errorMessage = error.message || 'OTT 계정 정보 수정에 실패했습니다.';
            set((state) => ({
                error: { ...state.error, detail: errorMessage }
            }));
            console.error("Failed to update OTT account:", error);
            throw error;
        } finally {
            set((state) => ({
                loading: { ...state.loading, detail: false }
            }));
        }
    },

    processLeaderDepositAction: async (partyId, paymentData) => {
        set((state) => ({
            loading: { ...state.loading, detail: true },
            error: { ...state.error, detail: null }
        }));
        try {
            const result = await processLeaderDeposit(partyId, paymentData);
            // Refresh party detail
            await get().loadPartyDetail(partyId);
            return result;
        } catch (error) {
            const errorMessage = error.message || '파티장 보증금 처리에 실패했습니다.';
            set((state) => ({
                error: { ...state.error, detail: errorMessage }
            }));
            console.error("Failed to process leader deposit:", error);
            throw error;
        } finally {
            set((state) => ({
                loading: { ...state.loading, detail: false }
            }));
        }
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
                    parties: null,
                    myParties: null,
                    detail: null,
                    create: null,
                    join: null,
                    leave: null,
                    products: null,
                }
            });
        }
    },

    // Reset store
    reset: () => {
        set({
            parties: [],
            myParties: [],
            currentParty: null,
            products: [],
            page: 1,
            hasMore: true,
            loading: {
                parties: false,
                myParties: false,
                detail: false,
                create: false,
                join: false,
                leave: false,
                products: false,
            },
            error: {
                parties: null,
                myParties: null,
                detail: null,
                create: null,
                join: null,
                leave: null,
                products: null,
            }
        });
    }
}));
