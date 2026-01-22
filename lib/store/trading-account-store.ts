// stores/tradingSyncStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { TradingSyncState } from "../types/trading-account-types";

export const useTradingSyncStore = create<TradingSyncState>()(
  devtools(
    (set, get) => ({
      // Initial UI State
      selectedAccount: null,
      selectedPlatform: null,
      connectionDialogOpen: false,
      activeTab: "overview",
      searchQuery: "",
      filterStatus: "all",
      syncingAll: false,

      // Initial Form State
      connectionForm: {
        apiKey: "",
        apiSecret: "",
        showApiSecret: false,
        accountNickname: "",
        server: "live",
        readOnly: true,
      },

      // UI Actions
      setSelectedAccount: (account) => set({ selectedAccount: account }),
      setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),
      setConnectionDialogOpen: (open) => set({ connectionDialogOpen: open }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterStatus: (status) => set({ filterStatus: status }),
      setSyncingAll: (syncing) => set({ syncingAll: syncing }),

      // Form Actions
      updateConnectionForm: (updates) =>
        set((state) => ({
          connectionForm: { ...state.connectionForm, ...updates },
        })),

      resetConnectionForm: (platformName) =>
        set({
          connectionForm: {
            apiKey: "",
            apiSecret: "",
            showApiSecret: false,
            accountNickname: platformName ? `My ${platformName} Account` : "",
            server: "live",
            readOnly: true,
          },
        }),

      // Account Actions (these trigger API calls via SWR mutations)
      addAccount: (account) => {
        // This will be called after successful API response
        set({ selectedAccount: account });
      },

      removeAccount: (accountId) => {
        const { selectedAccount } = get();
        if (selectedAccount?.id === accountId) {
          set({ selectedAccount: null });
        }
      },

      updateAccount: (accountId, updates) => {
        const { selectedAccount } = get();
        if (selectedAccount?.id === accountId) {
          set({ selectedAccount: { ...selectedAccount, ...updates } });
        }
      },

      syncAccount: (accountId) => {
        // Optimistic update - will be confirmed by API
        const { selectedAccount } = get();
        if (selectedAccount?.id === accountId) {
          set({
            selectedAccount: {
              ...selectedAccount,
              status: "syncing",
              lastSyncAt: "Syncing...",
            },
          });
        }
      },

      syncAllAccounts: (accounts) => {
        set({ syncingAll: true });
      },
    }),
    { name: "TradingSyncStore" }
  )
);
