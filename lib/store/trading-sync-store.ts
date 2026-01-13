// stores/tradingSyncStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface Platform {
  id: string;
  name: string;
  icon: string;
  status: "popular" | "new" | "available" | "coming-soon";
  method: "oauth" | "api" | "manual" | "webhook";
  description: string;
  available: boolean;
  color: string;
}

export interface ConnectedAccount {
  id: string;
  platform: string;
  platformId: string;
  nickname: string;
  status: "connected" | "error" | "syncing" | "warning";
  lastSync: string;
  syncFrequency: string;
  totalTrades: number;
  connectionMethod: string;
  autoSync: boolean;
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  currency: string;
  leverage: number;
  isDemo: boolean;
  isPaperTrade: boolean;
  syncError?: string;
}

interface ConnectionFormState {
  apiKey: string;
  apiSecret: string;
  showApiSecret: boolean;
  accountNickname: string;
  server: string;
  readOnly: boolean;
}

interface TradingSyncState {
  // UI State
  selectedAccount: ConnectedAccount | null;
  selectedPlatform: Platform | null;
  connectionDialogOpen: boolean;
  activeTab: string;
  searchQuery: string;
  filterStatus: string;
  syncingAll: boolean;

  // Form State
  connectionForm: ConnectionFormState;

  // Actions
  setSelectedAccount: (account: ConnectedAccount | null) => void;
  setSelectedPlatform: (platform: Platform | null) => void;
  setConnectionDialogOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: string) => void;
  setSyncingAll: (syncing: boolean) => void;

  // Form Actions
  updateConnectionForm: (updates: Partial<ConnectionFormState>) => void;
  resetConnectionForm: (platformName?: string) => void;

  // Account Actions
  addAccount: (account: ConnectedAccount) => void;
  removeAccount: (accountId: string) => void;
  updateAccount: (
    accountId: string,
    updates: Partial<ConnectedAccount>
  ) => void;
  syncAccount: (accountId: string) => void;
  syncAllAccounts: (accounts: ConnectedAccount[]) => void;
}

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
              lastSync: "Syncing...",
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
