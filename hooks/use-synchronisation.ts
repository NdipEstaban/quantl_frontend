"use client";

// hooks/use-trading-account.ts
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { toast } from "sonner";
import {
  tradingAccountService,
  ConnectAccountData,
  UpdateAccountData,
} from "@/lib/services/trading-account-service";
import { ConnectedAccount, Platform } from "@/lib/types/trading-account-types";
import { useUserStore } from "@/lib/store/user-store";
import { useSynchronisationStore } from "@/lib/store/synchronisation-store";

// Fetch all connected accounts
export function useConnectedAccounts() {
  const { user } = useUserStore();
  const { setSelectedAccount } = useSynchronisationStore();
  const { data, error, isLoading, mutate, isValidating } = useSWR<
    BackendResponse<ConnectedAccount[]>
  >(
    "/api/accounts",
    () => tradingAccountService.getConnectedAccounts(user?.id || ""),
    {
      refreshInterval: 30 * 60 * 1000, // Refresh every 30 minutes
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      onError: (error) => {
        toast.error("Failed to fetch accounts");
        console.error("Fetch accounts error:", error);
      },
      onSuccess: (data) => {
        console.log("Fetched connected accounts:", data, ",user:", user);
        setSelectedAccount(data.data[0] || null); // Set first account as selected by defaul
        toast.success("Successfully fetched accounts");
      },
    },
  );

  return {
    accounts: data?.data ?? [],
    isLoading,
    isError: !!error,
    isValidating,
    mutate,
    error,
  };
}

// Connect a new account
export function useConnectAccount() {
  const { mutate: mutateAccounts } = useConnectedAccounts();

  const { trigger, isMutating, error } = useSWRMutation(
    "/api/accounts/connect",
    async (key, { arg }: { arg: ConnectAccountData }) => {
      try {
        const response = await tradingAccountService.connectAccount(arg);
        toast.success("Account connected successfully");

        // Revalidate the accounts list
        await mutateAccounts();

        return response;
      } catch (error: any) {
        const message =
          error.response?.data?.message || "Failed to connect account";
        toast.error(message);
        throw error;
      }
    },
  );

  return {
    connectAccount: trigger,
    isConnecting: isMutating,
    error,
  };
}

// Disconnect an account
export function useDisconnectAccount() {
  const { mutate: mutateAccounts } = useConnectedAccounts();

  const { trigger, isMutating, error } = useSWRMutation(
    "/api/accounts",
    async (key, { arg }: { arg: string }) => {
      try {
        const response = await tradingAccountService.disconnectAccount(arg);
        toast.success("Account disconnected successfully");

        // Revalidate the accounts list
        await mutateAccounts();

        return response;
      } catch (error: any) {
        const message =
          error.response?.data?.message || "Failed to disconnect account";
        toast.error(message);
        throw error;
      }
    },
  );

  return {
    disconnectAccount: trigger,
    isDisconnecting: isMutating,
    error,
  };
}

// Sync a single account
export function useSyncAccount() {
  const { mutate: mutateAccounts } = useConnectedAccounts();

  const { trigger, isMutating, error } = useSWRMutation(
    "/api/accounts/sync",
    async (key, { arg }: { arg: string }) => {
      try {
        console.log("synchronising all accounts");
        const response = await tradingAccountService.syncAccount(arg);
        toast.success("Account synced successfully");

        // Revalidate the accounts list to get updated sync status
        await mutateAccounts();

        return response;
      } catch (error: any) {
        const message =
          error.response?.data?.message || "Failed to sync account";
        toast.error(message);
        throw error;
      }
    },
  );

  return {
    syncAccount: trigger,
    isSyncing: isMutating,
    error,
  };
}

// Sync all accounts
export function useSyncAllAccounts() {
  const { mutate: mutateAccounts } = useConnectedAccounts();

  const { trigger, isMutating, error } = useSWRMutation(
    "/api/accounts/sync-all",
    async (key, { arg }: { arg: string }) => {
      try {
        console.log("synchronising all accounts");
        const response = await tradingAccountService.syncAllAccounts(arg);
        console.log("done synchonising", response);
        toast.success("All accounts synced successfully");

        // Revalidate the accounts list to get updated sync status
        await mutateAccounts();

        return response;
      } catch (error: any) {
        const message =
          error.response?.data?.message || "Failed to sync all accounts";
        toast.error(message);
        throw error;
      }
    },
  );

  return {
    syncAllAccounts: trigger,
    isSyncing: isMutating,
    error,
  };
}

// Update account settings
export function useUpdateAccount() {
  const { mutate: mutateAccounts } = useConnectedAccounts();
  const { updateAccount } = useSynchronisationStore();

  const { trigger, isMutating, error } = useSWRMutation(
    "/api/accounts/update",
    async (key, { arg }: { arg: UpdateAccountData }) => {
      try {
        const response = await tradingAccountService.updateAccount(arg);
        toast.success("Account updated successfully");

        // Revalidate the accounts list
        await mutateAccounts();

        // updated affected selected account
        updateAccount(arg.accountId, arg.updates);

        return response;
      } catch (error: any) {
        const message =
          error.response?.data?.message || "Failed to update account";
        toast.error(message);
        throw error;
      }
    },
  );

  return {
    updateAccount: trigger,
    isUpdating: isMutating,
    error,
  };
}

// Main hook that combines all trading account functionality
export function useTradingAccount() {
  const {
    accounts,
    isLoading: isLoadingAccounts,
    isError: isAccountsError,
    mutate: mutateAccounts,
    error: accountsError,
  } = useConnectedAccounts();

  const {
    connectAccount,
    isConnecting,
    error: connectError,
  } = useConnectAccount();

  const {
    disconnectAccount,
    isDisconnecting,
    error: disconnectError,
  } = useDisconnectAccount();

  const {
    syncAccount,
    isSyncing: isSyncingSingle,
    error: syncError,
  } = useSyncAccount();

  const {
    syncAllAccounts,
    isSyncing: isSyncingAll,
    error: syncAllError,
  } = useSyncAllAccounts();

  const { updateAccount, isUpdating, error: updateError } = useUpdateAccount();

  const isLoading = isLoadingAccounts;
  const isError = isAccountsError;
  const error = accountsError;

  return {
    // Data
    accounts,

    // Loading states
    isLoading,
    isLoadingAccounts,

    // Mutation loading states
    isConnecting,
    isDisconnecting,
    isSyncing: isSyncingSingle || isSyncingAll,
    isUpdating,

    // Error states
    isError,
    error,
    connectError,
    disconnectError,
    syncError,
    syncAllError,
    updateError,

    // Actions
    connectAccount,
    disconnectAccount,
    syncAccount,
    syncAllAccounts,
    updateAccount,
    mutateAccounts,
  };
}
