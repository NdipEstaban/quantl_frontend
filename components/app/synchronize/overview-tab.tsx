// components/TradingSync/OverviewTab.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Activity,
  RefreshCw,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ConnectedAccount, useTradingSyncStore } from "@/lib/store/trading-sync-store";
import { useSyncAllAccounts } from "@/hooks/use-trading-sync";
import { StatsCards } from "./statistics-card";
import { AccountCard } from "./account-card";
import { PortfolioSummary } from "./portfolio-summary";

interface OverviewTabProps {
  accounts: ConnectedAccount[];
  onAccountClick: (account: ConnectedAccount) => void;
  onSyncAll: () => void;
}

export function OverviewTab({
  accounts,
  onAccountClick,
  onSyncAll,
}: OverviewTabProps) {
  const { syncingAll } = useTradingSyncStore();
  const { syncAllAccounts, isSyncing } = useSyncAllAccounts();

  const activeAccountsCount = accounts.filter(
    (a) => a.status === "connected"
  ).length;

  const handleSyncAll = async () => {
    try {
      await syncAllAccounts();
      onSyncAll();
    } catch (error) {
      console.error("Failed to sync all accounts:", error);
    }
  };

  if (accounts.length === 0) {
    return (
      <Card className="p-12 text-center bg-card/50 border-border/50">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Activity className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">
              No Accounts Connected
            </h3>
            <p className="text-sm text-muted-foreground">
              Connect your first trading account to start tracking your trades
              automatically.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <StatsCards accounts={accounts} />

        <Card className="p-6 bg-card/50 border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Connected Accounts</h3>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleSyncAll}
              disabled={isSyncing || syncingAll || activeAccountsCount === 0}
            >
              <RefreshCw
                className={cn(
                  "w-3 h-3",
                  (isSyncing || syncingAll) && "animate-spin"
                )}
              />
              {isSyncing || syncingAll ? "Syncing..." : "Sync All"}
            </Button>
          </div>

          <div className="space-y-3">
            {accounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onClick={() => onAccountClick(account)}
              />
            ))}
          </div>
        </Card>

        <PortfolioSummary accounts={accounts} />
      </div>

      <div className="lg:col-span-1">
        {/* Side panel content can go here */}
      </div>
    </div>
  );
}
