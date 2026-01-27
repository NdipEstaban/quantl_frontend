// components/TradingSync/PortfolioSummary.tsx
import { Card } from "@/components/ui/card";
import {
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ConnectedAccount } from "@/lib/types/trading-account-types";

interface PortfolioSummaryProps {
  accounts: ConnectedAccount[];
}

const mockAccounts = [
  {
    id: "1",
    isDemo: false,
    balance: 5000,
    equity: 5250,
    margin: 1200,
    leverage: 100,
    status: "connected",
  },
  {
    id: "2",
    isDemo: false,
    balance: 3000,
    equity: 2850,
    margin: 800,
    leverage: 50,
    status: "connected",
  },
  {
    id: "3",
    isDemo: true,
    balance: 10000,
    equity: 10500,
    margin: 2000,
    leverage: 100,
    status: "connected",
  },
  {
    id: "4",
    isDemo: true,
    balance: 50000,
    equity: 49200,
    margin: 5000,
    leverage: 200,
    status: "error",
  },
];

export function PortfolioSummary({ accounts }: PortfolioSummaryProps) {
  // Separate demo and live accounts
  const liveAccounts = accounts.filter((acc) => !acc.isDemo);
  const demoAccounts = accounts.filter((acc) => acc.isDemo);

  // Calculate totals
  const totalPortfolioValue = accounts.reduce(
    (sum, acc) => sum + acc.equity,
    0,
  );
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalPnL = totalPortfolioValue - totalBalance;
  const totalPnLPercent =
    totalBalance > 0 ? ((totalPnL / totalBalance) * 100).toFixed(2) : "0.00";

  // Live accounts calculations
  const liveBalance = liveAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const liveEquity = liveAccounts.reduce((sum, acc) => sum + acc.equity, 0);
  const livePnL = liveEquity - liveBalance;
  const livePnLPercent =
    liveBalance > 0 ? ((livePnL / liveBalance) * 100).toFixed(2) : "0.00";

  // Demo accounts calculations
  const demoBalance = demoAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const demoEquity = demoAccounts.reduce((sum, acc) => sum + acc.equity, 0);
  const demoPnL = demoEquity - demoBalance;
  const demoPnLPercent =
    demoBalance > 0 ? ((demoPnL / demoBalance) * 100).toFixed(2) : "0.00";

  // Combined metrics
  const totalMargin = accounts.reduce((sum, acc) => sum + acc.margin, 0);
  const avgLeverage =
    accounts.length > 0
      ? Math.round(
          accounts.reduce((sum, acc) => sum + acc.leverage, 0) /
            accounts.length,
        )
      : 0;
  const marginUsagePercent =
    totalPortfolioValue > 0
      ? ((totalMargin / totalPortfolioValue) * 100).toFixed(1)
      : "0.0";

  return (
    <Card className="p-6 bg-primary/5 border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold mb-1">Total Portfolio Value</h3>
          <p className="text-xs text-muted-foreground">
            Across all connected accounts
          </p>
        </div>
        <div className="p-2 rounded-lg bg-primary/10">
          <DollarSign className="w-5 h-5 text-primary" />
        </div>
      </div>

      <div className="space-y-4">
        {/* Conditional rendering: Show breakdown only if both live and demo accounts exist */}
        {liveAccounts.length > 0 && demoAccounts.length > 0 ? (
          // Live vs Demo Breakdown
          <div className="grid grid-cols-2 gap-3">
            {/* Live Accounts */}
            <div className="p-3 rounded-lg bg-background/50 border">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">
                  LIVE ACCOUNTS
                </span>
              </div>
              <p className="text-lg font-bold mb-1">
                $
                {liveBalance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "text-xs font-medium flex items-center gap-0.5",
                    livePnL >= 0 ? "text-success" : "text-destructive",
                  )}
                >
                  {livePnL >= 0 ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  $
                  {Math.abs(livePnL).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span
                  className={cn(
                    "text-xs",
                    livePnL >= 0 ? "text-success" : "text-destructive",
                  )}
                >
                  ({livePnL >= 0 ? "+" : ""}
                  {livePnLPercent}%)
                </span>
              </div>
            </div>

            {/* Demo Accounts */}
            <div className="p-3 rounded-lg bg-background/50 border border-dashed">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  DEMO ACCOUNTS
                </span>
              </div>
              <p className="text-lg font-bold mb-1 text-muted-foreground">
                $
                {demoBalance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "text-xs font-medium flex items-center gap-0.5",
                    demoPnL >= 0 ? "text-success/70" : "text-destructive/70",
                  )}
                >
                  {demoPnL >= 0 ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  $
                  {Math.abs(demoPnL).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span
                  className={cn(
                    "text-xs",
                    demoPnL >= 0 ? "text-success/70" : "text-destructive/70",
                  )}
                >
                  ({demoPnL >= 0 ? "+" : ""}
                  {demoPnLPercent}%)
                </span>
              </div>
            </div>
          </div>
        ) : (
          // Single account type view (original style)
          <div>
            <p className="text-3xl font-bold mb-1">
              $
              {totalPortfolioValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-sm font-medium flex items-center gap-1",
                  totalPnL >= 0 ? "text-success" : "text-destructive",
                )}
              >
                {totalPnL >= 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                $
                {Math.abs(totalPnL).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                ({totalPnL >= 0 ? "+" : ""}
                {totalPnLPercent}%)
              </span>
              <span className="text-xs text-muted-foreground">Total P&L</span>
            </div>
          </div>
        )}
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-4 gap-4 pt-4 border-t">
        <StatCard
          label="Total Balance"
          value={`$${totalBalance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
        />
        <StatCard
          label="Margin Used"
          value={`$${totalMargin.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          sublabel={`${marginUsagePercent}% of equity`}
        />
        <StatCard label="Avg Leverage" value={`1:${avgLeverage}`} />
        <StatCard
          label="Active"
          value={`${accounts.filter((a) => a.isActive).length}/${accounts.length}`}
          sublabel="accounts"
        />
      </div>
    </Card>
  );
}

const StatCard = ({
  label,
  value,
  sublabel,
  variant = "default",
}: Record<string, string>) => (
  <div>
    <p className="text-xs text-muted-foreground mb-1">{label}</p>
    <p
      className={cn(
        "font-semibold",
        variant === "success" && "text-success",
        variant === "destructive" && "text-destructive",
      )}
    >
      {value}
    </p>
    {sublabel && (
      <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>
    )}
  </div>
);
