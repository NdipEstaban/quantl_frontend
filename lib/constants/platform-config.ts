import { Platform } from "../types/trading-account-types";

export const platformConfig: Record<string, Platform> = {
  mt5: {
    id: "mt5",
    name: "MetaTrader 5",
    icon: "TrendingUp",
    status: "available",
    method: "api",
    description:
      "Connect your MetaTrader 5 trading account via secure API integration.",
    available: true,
    color: "bg-blue-500",
  },

  ibkr: {
    id: "ibkr",
    name: "Interactive Brokers",
    icon: "BarChart3",
    status: "coming-soon",
    method: "api",
    description:
      "Integration with Interactive Brokers for professional trading access.",
    available: false,
    color: "bg-green-500",
  },

  tradingview: {
    id: "tradingview",
    name: "TradingView",
    icon: "Globe",
    status: "coming-soon",
    method: "webhook",
    description:
      "Import TradingView alerts and signals via webhook integration.",
    available: false,
    color: "bg-purple-500",
  },

  ctrader: {
    id: "ctrader",
    name: "cTrader",
    icon: "Cpu",
    status: "coming-soon",
    method: "api",
    description: "Connect cTrader accounts for advanced trading automation.",
    available: false,
    color: "bg-cyan-500",
  },

  binance: {
    id: "binance",
    name: "Binance",
    icon: "Wallet",
    status: "coming-soon",
    method: "api",
    description:
      "Connect your Binance account for crypto trading and portfolio tracking.",
    available: false,
    color: "bg-yellow-500",
  },

  manual: {
    id: "manual",
    name: "Manual Import",
    icon: "Upload",
    status: "coming-soon",
    method: "manual",
    description:
      "Manually upload or enter trading data without platform integration.",
    available: false,
    color: "bg-gray-500",
  },
};
