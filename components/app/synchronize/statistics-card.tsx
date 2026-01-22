// components/TradingSync/StatsCards.tsx
import { Card } from "@/components/ui/card";
import { ConnectedAccount } from "@/lib/types/trading-account-types";
import { CheckCircle2, Activity, RefreshCw } from "lucide-react";

interface StatsCardsProps {
  accounts: ConnectedAccount[];
}

export function StatsCards({ accounts }: StatsCardsProps) {
  const activeAccountsCount = accounts.filter(
    (account) => account.is
  ).length;

  const totalTrades = accounts.reduce((sum, account) => sum + account.numberOfTrades, 0);

  const autoSyncEnabledCount = accounts.filter((account) => account.autoSync).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="p-4 bg-card/50 border-border/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-success/10">
            <CheckCircle2 className="w-4 h-4 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold">{activeAccountsCount}</p>
            <p className="text-xs text-muted-foreground">Active Connections</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-card/50 border-border/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{totalTrades}</p>
            <p className="text-xs text-muted-foreground">Total Trades Synced</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-card/50 border-border/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-warning/10">
            <RefreshCw className="w-4 h-4 text-warning" />
          </div>
          <div>
            <p className="text-2xl font-bold">{autoSyncEnabledCount}</p>
            <p className="text-xs text-muted-foreground">Auto-Sync Enabled</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
