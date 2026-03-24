import { create } from "zustand";
import { loadMain } from "../../api/mainApi";

export const useMainStore = create((set, get) => ({
  products: [],
  parties: [],

  loading: false,
  productsLoading: false,
  partiesLoading: false,

  productsError: null,
  partiesError: null,

  loadMain: async () => {
    if (get().loading) return;

    set({
      loading: true,
      productsLoading: true,
      partiesLoading: true,
      productsError: null,
      partiesError: null,
    });

    const result = await loadMain();

    set({
      products: result.products || [],
      parties: result.parties || [],
      productsError: result.productsError || null,
      partiesError: result.partiesError || null,
      loading: false,
      productsLoading: false,
      partiesLoading: false,
    });
  },
}));
