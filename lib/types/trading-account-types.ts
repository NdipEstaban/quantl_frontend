import { LogAction } from "../constants/log-actions";

export enum platformBackendIds {
  MT5 = "MT5",
  MT4 = "MT4",
  CTRADER = "CTRADER",
  INTERACTIVE_BROKERS = "INTERACTIVE_BROKERS",
  BINANCE = "BINANCE",
  COINBASE = "COINBASE",
  ALPACA = "ALPACA",
  TRADINGVIEW = "TRADINGVIEW",
  ETORO = "ETORO",
  WEBULL = "WEBULL",
  TD_AMERITRADE = "TD_AMERITRADE",
  EXNESS = "EXNESS",
  OTHER = "OTHER",
}

export interface Platform {
  id: platformBackendIds;
  name: string;
  status: "popular" | "new" | "available" | "coming-soon";
  method: "oauth" | "api" | "manual" | "webhook";
  description: string;
  available: boolean;
  logoUrl: string;
}

export interface ConnectedAccount {
  id: string;
  platform: string;
  platformId: string;
  brokerName: string;
  accountName: string;
  status: "connected" | "error" | "syncing" | "warning";
  lastSyncAt: string;
  syncFrequency: number;
  numberOfTrades?: number;
  connectionMethod: string;
  autoSync: boolean;
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  currency: string;
  leverage: number;
  isActive: boolean;
  isDemo: boolean;
  isContest: boolean;
  syncError?: string;
  logs?: {
    createdAt: string;
    metadata: Record<string, any>;
    id: string;
    action: LogAction;
  }[];
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
    updates: Partial<ConnectedAccount>,
  ) => void;
  syncAccount: (accountId: string) => void;
  syncAllAccounts: (accounts: ConnectedAccount[]) => void;
}
