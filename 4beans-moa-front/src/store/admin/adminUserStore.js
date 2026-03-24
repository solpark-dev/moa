import { create } from "zustand";

export const useAdminUserStore = create((set) => ({
  users: [],
  totalCount: 0,
  totalPages: 1,

  page: 1,
  size: 10,
  sort: "regDate,desc",

  filters: {
    q: "",
    status: "ALL",
    joinStart: "",
    joinEnd: "",
  },

  loading: false,
  error: null,

  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    })),

  setPage: (value) => set({ page: value }),
  setSize: (value) => set({ size: value }),
  setSort: (value) => set({ sort: value }),

  setData: (data) =>
  set(() => {
    const list = data?.list || data?.content || [];
    const totalCount =
      typeof data?.totalCount === "number" ? data.totalCount : list.length;
    const totalPages =
      typeof data?.totalPages === "number"
        ? data.totalPages
        : totalCount > 0 && data?.size
        ? Math.ceil(totalCount / data.size)
        : 1;

    return {
      users: list,
      totalCount,
      totalPages,
    };
  }),

  setLoading: (value) => set({ loading: value }),
  setError: (value) => set({ error: value }),

  resetFilters: () =>
    set({
      filters: {
        q: "",
        status: "ALL",
        joinStart: "",
        joinEnd: "",
      },
      page: 1,
    }),
}));
