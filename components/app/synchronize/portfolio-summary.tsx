// components/TradingSync/PortfolioSummary.tsx
import { Card } from "@/components/ui/card";
import { DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConnectedAccount } from "@/lib/types/trading-account-types";

interface PortfolioSummaryProps {
  accounts: ConnectedAccount[];
}

export function PortfolioSummary({ accounts }: PortfolioSummaryProps) {
  const totalPortfolioValue = accounts.reduce(
    (sum, acc) => sum + acc.equity,
    0
  );
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalPnL = totalPortfolioValue - totalBalance;
  const totalPnLPercent =
    totalBalance > 0 ? ((totalPnL / totalBalance) * 100).toFixed(2) : "0.00";

  return (
    <Card className="p-6 bg-linear-to-br from-primary/5 to-primary/10 border-primary/20">
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
                totalPnL >= 0 ? "text-success" : "text-destructive"
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

        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Balance</p>
            <p className="font-semibold">
              $
              {totalBalance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Accounts</p>
            <p className="font-semibold">{accounts.length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Active</p>
            <p className="font-semibold">
              {accounts.filter((a) => a.status === "connected").length}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
