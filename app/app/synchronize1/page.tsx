// app/trading-sync/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { useSynchronisationStore } from "@/lib/store/synchronisation-store";
import {
  useConnectedAccounts,
  useDisconnectAccount,
  useSyncAccount,
  useUpdateAccount,
} from "@/hooks/use-synchronisation";
import { OverviewTab } from "@/components/app/synchronize/overview-tab";
import { ConnectionDialog } from "@/components/app/synchronize/connection-dialog";
import { platformConfig } from "@/lib/constants/platform-config";
import { AccountsTab } from "@/components/app/synchronize/accounts-tab";

export default function TradingSyncPage() {
  const {
    selectedAccount,
    selectedPlatform,
    activeTab,
    setSelectedAccount,
    setSelectedPlatform,
    setConnectionDialogOpen,
    setActiveTab,
    resetConnectionForm,
  } = useSynchronisationStore();

  const { accounts, isLoading, mutate } = useConnectedAccounts();
  const { syncAccount, isSyncing } = useSyncAccount();
  const { disconnectAccount, isDisconnecting } = useDisconnectAccount();
  const {
    updateAccount: updateSyncFrequency,
    isUpdating: isUpdatingSyncFrequency,
  } = useUpdateAccount();
  const {
    updateAccount: toggleAccountAutoSync,
    isUpdating: isTogglingAutoSync,
  } = useUpdateAccount();
  const platforms = platformConfig;

  console.log("TradingSyncPage Render:", {
    accounts,
    selectedAccount,
    selectedPlatform,
    activeTab,
  });
  const handleOpenConnectionDialog = (platformId?: string) => {
    if (platformId) {
      const platform = platforms[platformId];
      setSelectedPlatform(platform || null);
      resetConnectionForm(platform?.name);
    } else {
      setSelectedPlatform(null);
      resetConnectionForm();
    }
    setConnectionDialogOpen(true);
  };

  const handleAccountClick = (account: any) => {
    setSelectedAccount(account);
    setActiveTab("accounts");
  };

  const handleSyncAll = async () => {
    // Revalidate accounts after sync
    await mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-muted-foreground">Loading accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Account Sync</h1>
          <p className="text-sm text-muted-foreground">
            Connect your trading accounts to automatically import and track
            trades
          </p>
        </div>
        <Button className="gap-2" onClick={() => handleOpenConnectionDialog()}>
          <Plus className="w-4 h-4" />
          Connect Account
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="accounts">
            Accounts
            {accounts.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {accounts.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTab
            accounts={accounts.slice(0, 2)}
            onAccountClick={handleAccountClick}
            onSyncAll={handleSyncAll}
          />
        </TabsContent>

        <TabsContent value="accounts" className="space-y-6">
          {/* AccountsTab component would go here */}
          <AccountsTab
            accounts={accounts}
            selectedAccount={selectedAccount}
            selectAccount={setSelectedAccount}
            syncAccount={syncAccount}
            toggleAccountAutoSync={toggleAccountAutoSync}
            disconnectAccount={disconnectAccount}
            updateAccountSyncFrequency={updateSyncFrequency}
            isSyncing={isSyncing}
            isDisconnecting={isDisconnecting}
            isTogglingAutoSync={isTogglingAutoSync}
            isUpdatingSyncFrequency={isUpdatingSyncFrequency}
          />
        </TabsContent>
      </Tabs>

      <ConnectionDialog />
    </div>
  );
}
