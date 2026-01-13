// lib/platformConfig.ts
import {
  TrendingUp,
  BarChart3,
  Globe,
  Cpu,
  Wallet,
  Upload,
} from "lucide-react";

export const platformConfig: Record<
  string,
  { name: string; icon: any; color: string }
> = {
  mt4: {
    name: "MetaTrader 4/5",
    icon: TrendingUp,
    color: "bg-blue-500",
  },
  ibkr: {
    name: "Interactive Brokers",
    icon: BarChart3,
    color: "bg-green-500",
  },
  tradingview: {
    name: "TradingView",
    icon: Globe,
    color: "bg-purple-500",
  },
  ctrader: {
    name: "cTrader",
    icon: Cpu,
    color: "bg-cyan-500",
  },
  binance: {
    name: "Binance",
    icon: Wallet,
    color: "bg-yellow-500",
  },
  manual: {
    name: "Manual Import",
    icon: Upload,
    color: "bg-gray-500",
  },
};
