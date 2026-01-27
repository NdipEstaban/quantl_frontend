import { Platform, platformBackendIds } from "../types/trading-account-types";

// Define authentication field configurations for each platform
export interface AuthField {
  name: string;
  label: string;
  type: "text" | "password" | "select";
  placeholder?: string;
  required: boolean;
  options?: { value: string; label: string }[];
  helpText?: string;
}

export interface PlatformAuthConfig {
  fields: AuthField[];
  securityNotice?: string;
  requiresNickname?: boolean;
}

// Authentication configurations for each platform
export const platformAuthConfigs: Record<
  platformBackendIds,
  PlatformAuthConfig
> = {
  [platformBackendIds.MT5]: {
    fields: [
      {
        name: "login",
        label: "Account Number (Login)",
        type: "text",
        placeholder: "e.g., 12345678",
        required: true,
        helpText: "Your MT5 account number/login ID",
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "Enter your MT5 password",
        required: true,
      },
      {
        name: "server",
        label: "Server",
        type: "text",
        placeholder: "e.g., BrokerName-Demo or BrokerName-Live",
        required: true,
        helpText: "Your broker's server address (found in MT5 terminal)",
      },
    ],
    securityNotice:
      "Always use your investor password (read-only) when connectingthird-party applications",
    requiresNickname: false,
  },

  [platformBackendIds.INTERACTIVE_BROKERS]: {
    fields: [
      {
        name: "username",
        label: "IBKR Username",
        type: "text",
        placeholder: "Your Interactive Brokers username",
        required: true,
      },
      {
        name: "accountType",
        label: "Account Type",
        type: "select",
        required: true,
        options: [
          { value: "live", label: "Live Account" },
          { value: "paper", label: "Paper Trading Account" },
        ],
      },
    ],
    requiresNickname: true,
  },

  [platformBackendIds.BINANCE]: {
    fields: [
      {
        name: "apiKey",
        label: "API Key",
        type: "text",
        placeholder: "Enter your Binance API Key",
        required: true,
        helpText: "64-character API key from Binance API Management",
      },
      {
        name: "apiSecret",
        label: "API Secret",
        type: "password",
        placeholder: "Enter your Binance API Secret",
        required: true,
        helpText: "Keep this secret secure - it won't be shown again",
      },
    ],
    requiresNickname: true,
  },

  [platformBackendIds.CTRADER]: {
    fields: [
      {
        name: "clientId",
        label: "Client ID",
        type: "text",
        placeholder: "Your cTrader application Client ID",
        required: true,
        helpText: "From your cTrader Open API application",
      },
      {
        name: "clientSecret",
        label: "Client Secret",
        type: "password",
        placeholder: "Your cTrader application Client Secret",
        required: true,
      },
    ],
    requiresNickname: true,
  },

  [platformBackendIds.TRADINGVIEW]: {
    fields: [
      {
        name: "webhookUrl",
        label: "Webhook URL",
        type: "text",
        placeholder: "Will be generated after setup",
        required: false,
        helpText: "Use this URL in your TradingView alerts",
      },
    ],
    requiresNickname: true,
  },

  [platformBackendIds.OTHER]: {
    fields: [],
    requiresNickname: false,
  },
};

export const platformConfig: Record<string, Platform> = {
  MT5: {
    id: platformBackendIds.MT5,
    name: "MetaTrader 5",
    status: "available",
    method: "api",
    description:
      "Connect using your MT5 account number, password, and broker server.",
    available: true,
    logoUrl: "/trading_platform_logos/mt5.webp",
  },

  manual: {
    id: platformBackendIds.OTHER,
    name: "Manual Import",
    status: "coming-soon",
    method: "manual",
    description:
      "Manually upload or enter trading data without platform integration.",
    available: false,
    logoUrl: "/trading_platform_logos/import.webp",
  },

  ibkr: {
    id: platformBackendIds.INTERACTIVE_BROKERS,
    name: "Interactive Brokers",
    status: "coming-soon",
    method: "oauth",
    description:
      "Connect via OAuth 2.0 or Client Portal Gateway for secure access.",
    available: false,
    logoUrl: "/trading_platform_logos/ibkr.webp",
  },

  tradingview: {
    id: platformBackendIds.TRADINGVIEW,
    name: "TradingView",
    status: "coming-soon",
    method: "webhook",
    description:
      "Import TradingView alerts and signals via webhook integration.",
    available: false,
    logoUrl: "/trading_platform_logos/tradingview.webp",
  },

  ctrader: {
    id: platformBackendIds.CTRADER,
    name: "cTrader",
    status: "coming-soon",
    method: "oauth",
    description:
      "Connect using OAuth 2.0 with your cTrader Open API application.",
    available: false,
    logoUrl: "/trading_platform_logos/ctrader.webp",
  },

  binance: {
    id: platformBackendIds.BINANCE,
    name: "Binance",
    status: "coming-soon",
    method: "api",
    description:
      "Connect using API Key and Secret for crypto trading and portfolio tracking.",
    available: false,
    logoUrl: "/trading_platform_logos/binance.webp",
  },
};

export const getPlatformsList = (): Platform[] => {
  return Object.values(platformConfig);
};

export const getAvailablePlatforms = (): Platform[] => {
  return getPlatformsList().filter((platform) => platform.available);
};

export const getPlatformAuthConfig = (
  platformId: platformBackendIds,
): PlatformAuthConfig | null => {
  return platformAuthConfigs[platformId] || null;
};
