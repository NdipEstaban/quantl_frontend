// components/TradingSync/OverviewTab.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSyncAllAccounts } from "@/hooks/use-synchronisation";
import { StatsCards } from "./statistics-card";
import { AccountCard } from "./account-card";
import { PortfolioSummary } from "./portfolio-summary";
import { ConnectedAccount } from "@/lib/types/trading-account-types";
import { useUserStore } from "@/lib/store/user-store";

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
  console.log("Rendering OverviewTab with accounts:", accounts);
  const { syncAllAccounts, isSyncing } = useSyncAllAccounts();
  const { user } = useUserStore();

  const activeAccountsCount = accounts.filter((a) => a.isActive).length;

  // Calculate stats for Sync Status card
  const syncingAccountsCount = accounts.filter(
    (a) => a.status === "syncing",
  ).length;
  const errorAccountsCount = accounts.filter((a) => a.syncError).length;

  const handleSyncAll = async () => {
    try {
      if (user && user.id) {
        await syncAllAccounts(user.id);
        onSyncAll();
      }
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
              disabled={isSyncing}
            >
              <RefreshCw
                className={cn("w-3 h-3", isSyncing && "animate-spin")}
              />
              {isSyncing ? "Syncing..." : "Sync All"}
            </Button>
          </div>

          <div className="space-y-3">
            {accounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onClick={() => onAccountClick(account)}
                syncing={isSyncing}
              />
            ))}
          </div>
        </Card>

        <PortfolioSummary accounts={accounts} />
      </div>

      {/* Side Panel*/}
      <div className="lg:col-span-1 space-y-6">
        {/* Sync Status Card */}
        <Card className="p-5 bg-card/50 border-border/50">
          <h3 className="font-semibold mb-4">Sync Status</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Active Accounts</span>
              <span className="text-xl font-bold">{activeAccountsCount}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Currently Syncing</span>
              <span className="text-xl font-bold">{syncingAccountsCount}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Requires Attention</span>
              <span className="text-xl font-bold text-destructive">
                {errorAccountsCount}
              </span>
            </div>
          </div>
        </Card>

        {/* Sync Limits Card */}
        <Card className="p-5 bg-card/50 border-border/50">
          <h3 className="font-semibold mb-4">Sync Limits</h3>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Accounts Connected</span>
                <span className="font-medium">{accounts.length}/5</span>
              </div>
              <Progress value={(accounts.length / 5) * 100} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Daily Syncs</span>
                <span className="font-medium">Unlimited</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Historical Data</span>
                <span className="font-medium">90 days</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
          </div>
        </Card>

        {/* Security & Privacy Card */}
        <Card className="p-5 bg-primary/5 border-primary/20">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Security & Privacy</h3>
          </div>

          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <span>Read-only access to your trading history</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <span>Bank-level 256-bit encryption</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
