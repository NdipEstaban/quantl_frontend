// components/TradingSync/AccountsTab.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  RefreshCw,
  Unlink,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Wallet,
  ArrowRight,
  Cross,
  X,
} from "lucide-react";
import { cn, getDateString } from "@/lib/utils";
import { ConnectedAccount } from "@/lib/types/trading-account-types";
import { TabsContent } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import { UpdateAccountData } from "@/lib/services/trading-account-service";
import { LogAction } from "@/lib/constants/log-actions";
import Image from "next/image";
import { platformConfig } from "@/lib/constants/platform-config";

interface AccountsTabProps {
  accounts: ConnectedAccount[];
  selectedAccount: ConnectedAccount | null;
  selectAccount: (account: ConnectedAccount) => void;
  syncAccount: (accountId: string) => void;
  toggleAccountAutoSync: (data: UpdateAccountData) => void;
  updateAccountSyncFrequency: (data: UpdateAccountData) => void;
  disconnectAccount: (accountId: string) => void;
  isSyncing: boolean;
  isDisconnecting: boolean;
  isTogglingAutoSync: boolean;
  isUpdatingSyncFrequency: boolean;
}

const SYNC_FREQUENCIES = [
  { label: "5 minutes", value: 5 * 60 },
  { label: "15 minutes", value: 15 * 60 },
  { label: "30 minutes", value: 30 * 60 },
  { label: "1 hour", value: 60 * 60 },
  { label: "4 hours", value: 4 * 60 * 60 },
  { label: "24 hours", value: 24 * 60 * 60 },
];

export function AccountsTab({
  accounts,
  selectedAccount,
  selectAccount,
  syncAccount,
  toggleAccountAutoSync,
  updateAccountSyncFrequency,
  disconnectAccount,
  isSyncing,
  isDisconnecting,
  isTogglingAutoSync,
  isUpdatingSyncFrequency,
}: AccountsTabProps) {
  const handleUpdateSyncFrequency = (valueInSeconds: string) => {
    updateAccountSyncFrequency({
      accountId: selectedAccount ? selectedAccount.id : "",
      updates: {
        syncFrequency: parseInt(valueInSeconds),
      },
    });
  };

  // Helper function to get label from value
  const getSyncFrequencyLabel = (seconds: number) => {
    const freq = SYNC_FREQUENCIES.find((f) => f.value === seconds);
    return freq ? freq.label : seconds;
  };

  if (accounts.length === 0) {
    return (
      <Card className="p-8 sm:p-12 text-center bg-card/50 border-border/50">
        <p className="text-muted-foreground text-sm sm:text-base">
          No accounts connected. Connect your first trading account to get
          started.
        </p>
      </Card>
    );
  }

  return (
    <TabsContent value="accounts" className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Accounts List - Mobile: Full width, Desktop: 1/3 */}
        <Card className="p-4 bg-card/50 border-border/50 lg:col-span-1">
          <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
            Your Accounts
          </h3>
          <div className="space-y-2">
            {accounts.map((account) => {
              const isSelected = selectedAccount?.id === account.id;
              return (
                <div
                  key={account.id}
                  onClick={() => selectAccount(account)}
                  className={cn(
                    "flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg cursor-pointer transition-all",
                    isSelected
                      ? "bg-primary/10 border border-primary/30 shadow-sm"
                      : "bg-secondary/30 hover:bg-secondary/50 border border-transparent",
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg shrink-0",
                      isSelected ? "bg-primary/20" : "bg-secondary/50",
                    )}
                  >
                    <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs sm:text-sm truncate">
                      {account.accountName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {account.numberOfTrades} trades
                    </p>
                  </div>
                  {isSelected && (
                    <ArrowRight className="w-4 h-4 text-primary shrink-0 hidden sm:block" />
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Account Details - Mobile: Full width, Desktop: 2/3 */}
        {selectedAccount ? (
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Account Overview */}
            <Card className="p-4 sm:p-6 bg-card/50 border-border/50">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div
                    className={cn(
                      "rounded-lg bg-primary/20 shrink-0",
                    )}
                  >
                    <Image
                      className="rounded-lg shrink-0"
                      width={51}
                      height={51}
                      src={platformConfig[selectedAccount.platform].logoUrl}
                      alt={selectedAccount.platform + " logo"}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h2 className="text-lg sm:text-xl font-bold truncate">
                        {selectedAccount.accountName}
                      </h2>
                      {selectedAccount.isDemo && (
                        <Badge variant="outline" className="text-xs shrink-0">
                          Demo
                        </Badge>
                      )}
                      <Badge className="bg-success/10 text-success text-xs shrink-0">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {selectedAccount.brokerName} • Last sync:{" "}
                      <span className="hidden sm:inline">
                        {getDateString(selectedAccount.lastSyncAt)}
                      </span>
                      <span className="sm:hidden">
                        {getDateString(selectedAccount.lastSyncAt)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Grid - Responsive */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                <div className="p-2.5 sm:p-3 rounded-lg bg-secondary/30">
                  <p className="text-xs text-muted-foreground mb-1">Balance</p>
                  <p className="text-sm sm:text-lg font-bold truncate">
                    {selectedAccount.balance.toLocaleString()}{" "}
                    <span className="text-xs sm:text-sm">
                      {selectedAccount.currency}
                    </span>
                  </p>
                </div>
                <div className="p-2.5 sm:p-3 rounded-lg bg-secondary/30">
                  <p className="text-xs text-muted-foreground mb-1">Equity</p>
                  <p className="text-sm sm:text-lg font-bold truncate">
                    {selectedAccount.equity.toLocaleString()}
                  </p>
                </div>
                <div className="p-2.5 sm:p-3 rounded-lg bg-secondary/30">
                  <p className="text-xs text-muted-foreground mb-1">Trades</p>
                  <p className="text-sm sm:text-lg font-bold">
                    {selectedAccount.numberOfTrades}
                  </p>
                </div>
                <div className="p-2.5 sm:p-3 rounded-lg bg-secondary/30">
                  <p className="text-xs text-muted-foreground mb-1">Leverage</p>
                  <p className="text-sm sm:text-lg font-bold">
                    1:{selectedAccount.leverage}
                  </p>
                </div>
              </div>
            </Card>

            {/* Connection Settings */}
            <Card className="p-4 sm:p-6 bg-card/50 border-border/50">
              <h3 className="text-base sm:text-lg font-semibold sm:mb-4">
                Connection Settings
                <p className="text-xs sm:text-sm mt-2 text-muted-foreground sm:mb-6">
                  Manage your connection and sync preferences
                </p>
              </h3>

              <div className="space-y-4 sm:space-y-6">
                {/* Sync Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-secondary/20 border">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => syncAccount(selectedAccount.id)}
                      disabled={selectedAccount.status === "syncing"}
                      className="gap-2 w-full sm:w-auto"
                    >
                      {isSyncing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          Sync Now
                        </>
                      )}
                    </Button>
                    <div className="flex items-center gap-3">
                      {isTogglingAutoSync ? (
                        <RefreshCw className="animate-spin" />
                      ) : (
                        <Switch
                          checked={selectedAccount.autoSync}
                          onCheckedChange={() =>
                            toggleAccountAutoSync({
                              accountId: selectedAccount.id,
                              updates: {
                                autoSync: !selectedAccount.autoSync,
                              },
                            })
                          }
                        />
                      )}

                      <div>
                        <p className="text-xs sm:text-sm font-medium">
                          Auto-sync
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2 w-full sm:w-auto"
                    onClick={() => disconnectAccount(selectedAccount.id)}
                  >
                    {isDisconnecting ? (
                      <RefreshCw className="animate-spin" />
                    ) : (
                      <Unlink className="w-4 h-4" />
                    )}
                    Disconnect
                  </Button>
                </div>

                {/* Sync Frequency */}
                <div className="space-y-2 sm:space-y-3">
                  <Label className="text-xs sm:text-sm">Sync Frequency</Label>
                  <Select
                    value={selectedAccount.syncFrequency.toString()}
                    onValueChange={handleUpdateSyncFrequency}
                    disabled={isUpdatingSyncFrequency}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue>
                        {isUpdatingSyncFrequency ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          `Every ${getSyncFrequencyLabel(selectedAccount.syncFrequency)}`
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {SYNC_FREQUENCIES.map((freq) => (
                        <SelectItem
                          key={freq.value}
                          value={freq.value.toString()}
                        >
                          Every {freq.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    How often to check for new trades
                  </p>
                </div>
              </div>
            </Card>

            {/* Security Notice */}
            <Card className="p-3 sm:p-4 bg-warning/5 border-warning/20">
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-warning shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-xs sm:text-sm mb-1">
                    Security Notice
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Always use your{" "}
                    <span className="font-medium text-warning">
                      investor password
                    </span>{" "}
                    (read-only) when connecting third-party applications. Never
                    share your master trading password.
                  </p>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            {selectedAccount.logs && (
              <Card className="p-4 sm:p-6 bg-card/50 border-border/50">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="font-semibold text-sm sm:text-base">
                    Recent Sync Activity
                  </h3>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {selectedAccount.logs.slice(0, 5).map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-secondary/20"
                    >
                      {log.metadata.success ? (
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-destructive shrink-0" />
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm truncate">
                          {log.action === LogAction.ACCOUNT_LINKED ? (
                            <>Account linked</>
                          ) : (
                            <>
                              {log.metadata.newTrades > 0 ? (
                                <>Synced {log.metadata.newTrades} new trades</>
                              ) : (
                                <>No new trades</>
                              )}
                            </>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getDateString(log.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        ) : (
          <Card className="lg:col-span-2 p-8 sm:p-12 text-center bg-card/50 border-border/50 flex flex-col items-center justify-center min-h-100">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Select an Account
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Choose an account from the list to view details, manage settings,
              and monitor sync activity
            </p>
          </Card>
        )}
      </div>
    </TabsContent>
  );
}
