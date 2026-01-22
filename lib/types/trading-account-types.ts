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
  accountName: string;
  status: "connected" | "error" | "syncing" | "warning";
  lastSyncAt: string;
  syncFrequency: string;
  numberOfTrades: number;
  connectionMethod: string;
  autoSync: boolean;
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  currency: string;
  leverage: number;
  isActive:boolean;
  isDemo: boolean;
  isPaperTrade: boolean;
  syncError?: string;
}

export interface ConnectionFormState {
  apiKey: string;
  apiSecret: string;
  showApiSecret: boolean;
  accountNickname: string;
  server: string;
  readOnly: boolean;
}

export interface TradingSyncState {
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
