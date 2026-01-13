// hooks/useTradingSync.ts
import { ConnectedAccount, Platform } from "@/lib/store/trading-sync-store";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Fetch all connected accounts
export function useConnectedAccounts() {
  const { data, error, isLoading, mutate } = useSWR<ConnectedAccount[]>(
    "/api/accounts",
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  return {
    accounts: data ?? [],
    isLoading,
    isError: error,
    mutate,
  };
}

// Fetch available platforms
export function usePlatforms() {
  const { data, error, isLoading } = useSWR<Platform[]>(
    "/api/platforms",
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false, // Platforms rarely change
    }
  );

  return {
    platforms: data ?? [],
    isLoading,
    isError: error,
  };
}

// Connect a new account
interface ConnectAccountArgs {
  arg: {
    platformId: string;
    apiKey: string;
    apiSecret: string;
    nickname: string;
    server: string;
    readOnly: boolean;
  };
}

async function connectAccountFetcher(url: string, { arg }: ConnectAccountArgs) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    throw new Error("Failed to connect account");
  }

  return response.json();
}

export function useConnectAccount() {
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/accounts/connect",
    connectAccountFetcher
  );

  return {
    connectAccount: trigger,
    isConnecting: isMutating,
    error,
  };
}

// Disconnect an account
async function disconnectAccountFetcher(url: string, { arg }: { arg: string }) {
  const response = await fetch(`${url}/${arg}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to disconnect account");
  }

  return response.json();
}

export function useDisconnectAccount() {
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/accounts",
    disconnectAccountFetcher
  );

  return {
    disconnectAccount: trigger,
    isDisconnecting: isMutating,
    error,
  };
}

// Sync a single account
async function syncAccountFetcher(url: string, { arg }: { arg: string }) {
  const response = await fetch(`${url}/${arg}/sync`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to sync account");
  }

  return response.json();
}

export function useSyncAccount() {
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/accounts",
    syncAccountFetcher
  );

  return {
    syncAccount: trigger,
    isSyncing: isMutating,
    error,
  };
}

// Sync all accounts
async function syncAllAccountsFetcher(url: string) {
  const response = await fetch(url, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to sync all accounts");
  }

  return response.json();
}

export function useSyncAllAccounts() {
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/accounts/sync-all",
    syncAllAccountsFetcher
  );

  return {
    syncAllAccounts: trigger,
    isSyncing: isMutating,
    error,
  };
}

// Update account settings
interface UpdateAccountArgs {
  arg: {
    accountId: string;
    updates: Partial<ConnectedAccount>;
  };
}

async function updateAccountFetcher(url: string, { arg }: UpdateAccountArgs) {
  const response = await fetch(`${url}/${arg.accountId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg.updates),
  });

  if (!response.ok) {
    throw new Error("Failed to update account");
  }

  return response.json();
}

export function useUpdateAccount() {
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/accounts",
    updateAccountFetcher
  );

  return {
    updateAccount: trigger,
    isUpdating: isMutating,
    error,
  };
}
